<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Devis;
use App\Models\Client;
use App\Models\BonDeCommande;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();
        $debutMois = $now->copy()->startOfMonth();
        $finMois = $now->copy()->endOfMonth();

        // Chiffre d'affaires du mois
        $chiffreAffairesMois = Facture::where('statut', 'payee')
            ->whereBetween('date_facture', [$debutMois, $finMois])
            ->sum('montant_ttc');

        // Factures payées ce mois
        $facturesPayees = Facture::where('statut', 'payee')
            ->whereBetween('date_facture', [$debutMois, $finMois]);
        $facturesPayeesData = [
            'montant' => (float) $facturesPayees->sum('montant_ttc'),
            'nombre' => $facturesPayees->count(),
        ];

        // Factures en attente
        $facturesEnAttente = Facture::where('statut', 'en_attente');
        $facturesEnAttenteData = [
            'montant' => (float) $facturesEnAttente->sum('montant_ttc'),
            'nombre' => $facturesEnAttente->count(),
        ];

        // Factures en retard
        $facturesEnRetard = Facture::where('date_echeance', '<', $now)
            ->whereIn('statut', ['en_attente', 'partiellement_payee', 'impayee']);
        $facturesEnRetardData = [
            'montant' => (float) $facturesEnRetard->sum('montant_ttc'),
            'nombre' => $facturesEnRetard->count(),
        ];

        // Devis en cours
        $devisValides = Devis::where('statut', 'valide')->count();
        $devisRefuses = Devis::where('statut', 'refuse')->count();
        $totalDevis = $devisValides + $devisRefuses;
        $tauxConversion = $totalDevis > 0 ? round(($devisValides / $totalDevis) * 100, 1) : 0;

        $devisEnCours = [
            'nombre' => Devis::whereIn('statut', ['brouillon', 'valide', 'envoye'])->count(),
            'taux_conversion' => $tauxConversion . '%',
        ];

        // Nouveaux clients du mois
        $nouveauxClients = Client::whereBetween('created_at', [$debutMois, $finMois])->count();

        // CA mensuel (12 mois)
        $caMensuel = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $debut = $date->copy()->startOfMonth();
            $fin = $date->copy()->endOfMonth();
            $total = Facture::where('statut', 'payee')
                ->whereBetween('date_facture', [$debut, $fin])
                ->sum('montant_ttc');
            $caMensuel[] = [
                'mois' => $date->format('m'),
                'annee' => $date->format('Y'),
                'mois_annee' => $date->format('F Y'),
                'total' => (float) $total,
            ];
        }

        // Répartition par statut
        $statutsFactures = Facture::select('statut', DB::raw('count(*) as count'), DB::raw('sum(montant_ttc) as total'))
            ->groupBy('statut')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['statut'] => ['count' => $item['count'], 'total' => (float) $item['total']]];
            });

        // Évolution devis/factures (6 derniers mois)
        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $debut = $date->copy()->startOfMonth();
            $fin = $date->copy()->endOfMonth();
            $evolution[] = [
                'mois_annee' => $date->format('F Y'),
                'devis_count' => Devis::whereBetween('created_at', [$debut, $fin])->count(),
                'facture_count' => Facture::whereBetween('created_at', [$debut, $fin])->count(),
            ];
        }

        // Activité récente (5 derniers documents)
        $devisRecents = Devis::with('client:id,nom')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($d) {
                return [
                    'type' => 'devis',
                    'id' => $d->id,
                    'numero' => $d->numero_devis,
                    'client' => $d->client->nom ?? null,
                    'montant' => (float) $d->montant_ttc,
                    'statut' => $d->statut,
                    'created_at' => $d->created_at,
                ];
            });

        $commandesRecentes = Commande::with('client:id,nom')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($c) {
                return [
                    'type' => 'commande',
                    'id' => $c->id,
                    'numero' => $c->numero_commande,
                    'client' => $c->client->nom ?? null,
                    'montant' => (float) $c->montant_ttc,
                    'statut' => $c->statut,
                    'created_at' => $c->created_at,
                ];
            });

        $facturesRecentes = Facture::with('client:id,nom')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($f) {
                return [
                    'type' => 'facture',
                    'id' => $f->id,
                    'numero' => $f->numero_facture,
                    'client' => $f->client->nom ?? null,
                    'montant' => (float) $f->montant_ttc,
                    'statut' => $f->statut,
                    'created_at' => $f->created_at,
                ];
            });

        $activiteRecente = $devisRecents->concat($commandesRecentes)->concat($facturesRecentes)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->toArray();

        // Alertes
        $alertesFacturesRetard = Facture::where('date_echeance', '<', $now)
            ->whereIn('statut', ['en_attente', 'partiellement_payee', 'impayee'])
            ->with('client:id,nom')
            ->get(['id', 'numero_facture', 'client_id', 'montant_ttc', 'date_echeance', 'statut'])
            ->toArray();

        $devisExpires = Devis::where('date_validite', '<', $now)
            ->where('statut', 'brouillon')
            ->with('client:id,nom')
            ->get(['id', 'numero_devis', 'client_id', 'montant_ttc', 'date_validite'])
            ->toArray();

        $bonsNonTraites = BonDeCommande::where('statut', 'brouillon')
            ->with('fournisseur:id,nom')
            ->get(['id', 'numero_bc', 'fournisseur_id', 'montant_ttc', 'statut'])
            ->toArray();

        return response()->json([
            'chiffre_affaires_mois' => (float) $chiffreAffairesMois,
            'factures_payees' => $facturesPayeesData,
            'factures_en_attente' => $facturesEnAttenteData,
            'factures_en_retard' => $facturesEnRetardData,
            'devis_en_cours' => $devisEnCours,
            'nouveaux_clients_mois' => $nouveauxClients,
            'ca_mensuel' => $caMensuel,
            'statuts_factures' => $statutsFactures,
            'evolution_devis_factures' => $evolution,
            'activite_recente' => $activiteRecente,
            'alertes' => [
                'factures_en_retard' => $alertesFacturesRetard,
                'devis_expires' => $devisExpires,
                'bons_commande_non_traites' => $bonsNonTraites,
            ],
        ]);
    }
}
