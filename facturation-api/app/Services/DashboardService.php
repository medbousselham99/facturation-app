<?php

namespace App\Services;

use App\Models\BonDeCommande;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Devis;
use App\Models\Facture;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboard(): array
    {
        $now = now();
        $debutMois = $now->copy()->startOfMonth();
        $finMois = $now->copy()->endOfMonth();

        return [
            'chiffre_affaires_mois' => $this->chiffreAffairesMois($debutMois, $finMois),
            'factures_payees' => $this->facturesParStatut('payee', $debutMois, $finMois),
            'factures_en_attente' => $this->facturesParStatut('en_attente'),
            'factures_en_retard' => $this->facturesEnRetard($now),
            'devis_en_cours' => $this->devisEnCours(),
            'nouveaux_clients_mois' => Client::whereBetween('created_at', [$debutMois, $finMois])->count(),
            'ca_mensuel' => $this->caMensuel($now),
            'statuts_factures' => $this->repartitionStatuts(),
            'evolution_devis_factures' => $this->evolution($now),
            'activite_recente' => $this->activiteRecente(),
            'alertes' => $this->alertes($now),
        ];
    }

    private function chiffreAffairesMois($debut, $fin): float
    {
        return (float) Facture::where('statut', 'payee')
            ->whereBetween('date_facture', [$debut, $fin])
            ->sum('montant_ttc');
    }

    private function facturesParStatut(string $statut, $debut = null, $fin = null): array
    {
        $query = Facture::where('statut', $statut);

        if ($debut && $fin) {
            $query->whereBetween('date_facture', [$debut, $fin]);
        }

        return [
            'montant' => (float) $query->sum('montant_ttc'),
            'nombre' => $query->count(),
        ];
    }

    private function facturesEnRetard($now): array
    {
        $query = Facture::where('date_echeance', '<', $now)
            ->whereIn('statut', ['en_attente', 'partiellement_payee', 'impayee']);

        return [
            'montant' => (float) $query->sum('montant_ttc'),
            'nombre' => $query->count(),
        ];
    }

    private function devisEnCours(): array
    {
        $stats = Devis::selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN statut = 'valide' THEN 1 ELSE 0 END) as valides,
                SUM(CASE WHEN statut = 'refuse' THEN 1 ELSE 0 END) as refuses
            ")->whereIn('statut', ['brouillon', 'valide', 'envoye', 'refuse'])
            ->first();

        $totalDecisifs = ($stats->valides + $stats->refuses) ?: 0;
        $taux = $totalDecisifs > 0 ? round(($stats->valides / $totalDecisifs) * 100, 1) : 0;

        return [
            'nombre' => (int) $stats->total,
            'taux_conversion' => $taux . '%',
        ];
    }

    private function caMensuel($now): array
    {
        $onzeMoisAvis = $now->copy()->subMonths(11)->startOfMonth();

        $rows = Facture::where('statut', 'payee')
            ->where('date_facture', '>=', $onzeMoisAvis)
            ->selectRaw("strftime('%m', date_facture) as mois, strftime('%Y', date_facture) as annee, SUM(montant_ttc) as total")
            ->groupBy('annee', 'mois')
            ->orderBy('annee')
            ->orderBy('mois')
            ->get()
            ->keyBy(fn($r) => $r->annee . '-' . $r->mois);

        $ca = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $key = $date->format('Y-m');
            $moisData = $rows->get($key);

            $ca[] = [
                'mois' => $date->format('m'),
                'annee' => $date->format('Y'),
                'mois_annee' => $date->format('F Y'),
                'total' => (float) ($moisData->total ?? 0),
            ];
        }

        return $ca;
    }

    private function repartitionStatuts(): array
    {
        return Facture::selectRaw("statut, COUNT(*) as count, SUM(montant_ttc) as total")
            ->groupBy('statut')
            ->get()
            ->mapWithKeys(fn($item) => [
                $item->statut => ['count' => (int) $item->count, 'total' => (float) $item->total],
            ])
            ->toArray();
    }

    private function evolution($now): array
    {
        $sixMoisAvis = $now->copy()->subMonths(5)->startOfMonth();

        $devisParMois = Devis::where('created_at', '>=', $sixMoisAvis)
            ->selectRaw("strftime('%Y-%m', created_at) as mois, COUNT(*) as count")
            ->groupBy('mois')
            ->pluck('count', 'mois');

        $facturesParMois = Facture::where('created_at', '>=', $sixMoisAvis)
            ->selectRaw("strftime('%Y-%m', created_at) as mois, COUNT(*) as count")
            ->groupBy('mois')
            ->pluck('count', 'mois');

        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $key = $date->format('Y-m');
            $evolution[] = [
                'mois_annee' => $date->format('F Y'),
                'devis_count' => (int) ($devisParMois[$key] ?? 0),
                'facture_count' => (int) ($facturesParMois[$key] ?? 0),
            ];
        }

        return $evolution;
    }

    private function activiteRecente(): array
    {
        $devis = Devis::with('client:id,nom')
            ->latest()->take(5)->get()
            ->map(fn($d) => [
                'type' => 'devis', 'id' => $d->id, 'numero' => $d->numero_devis,
                'client' => $d->client?->nom, 'montant' => (float) $d->montant_ttc,
                'statut' => $d->statut, 'created_at' => $d->created_at,
            ]);

        $commandes = Commande::with('client:id,nom')
            ->latest()->take(5)->get()
            ->map(fn($c) => [
                'type' => 'commande', 'id' => $c->id, 'numero' => $c->numero_commande,
                'client' => $c->client?->nom, 'montant' => (float) $c->montant_ttc,
                'statut' => $c->statut, 'created_at' => $c->created_at,
            ]);

        $factures = Facture::with('client:id,nom')
            ->latest()->take(5)->get()
            ->map(fn($f) => [
                'type' => 'facture', 'id' => $f->id, 'numero' => $f->numero_facture,
                'client' => $f->client?->nom, 'montant' => (float) $f->montant_ttc,
                'statut' => $f->statut, 'created_at' => $f->created_at,
            ]);

        return $devis->concat($commandes)->concat($factures)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->toArray();
    }

    private function alertes($now): array
    {
        return [
            'factures_en_retard' => Facture::where('date_echeance', '<', $now)
                ->whereIn('statut', ['en_attente', 'partiellement_payee', 'impayee'])
                ->with('client:id,nom')
                ->get(['id', 'numero_facture', 'client_id', 'montant_ttc', 'date_echeance', 'statut'])
                ->toArray(),

            'devis_expires' => Devis::where('date_validite', '<', $now)
                ->where('statut', 'brouillon')
                ->with('client:id,nom')
                ->get(['id', 'numero_devis', 'client_id', 'montant_ttc', 'date_validite'])
                ->toArray(),

            'bons_commande_non_traites' => BonDeCommande::where('statut', 'brouillon')
                ->with('fournisseur:id,nom')
                ->get(['id', 'numero_bc', 'fournisseur_id', 'montant_ttc', 'statut'])
                ->toArray(),
        ];
    }
}
