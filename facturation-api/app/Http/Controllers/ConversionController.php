<?php

namespace App\Http\Controllers;

use App\Models\Devis;
use App\Models\Commande;
use App\Models\Facture;
use App\Models\BonDeCommande;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConversionController extends Controller
{
    public function devisEnCommande(Request $request, Devis $devis)
    {
        $validated = $request->validate([
            'date_commande' => 'nullable|date',
            'statut' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $numeroCommande = 'CMD-' . date('Y') . '-' . str_pad(Commande::withTrashed()->count() + 1, 4, '0', STR_PAD_LEFT);

        $commande = DB::transaction(function () use ($devis, $validated, $numeroCommande) {
            $commande = Commande::create([
                'numero_commande' => $numeroCommande,
                'client_id' => $devis->client_id,
                'devis_id' => $devis->id,
                'date_commande' => $validated['date_commande'] ?? now(),
                'statut' => $validated['statut'] ?? 'brouillon',
                'montant_ht' => $devis->montant_ht,
                'montant_tva' => $devis->montant_tva,
                'montant_ttc' => $devis->montant_ttc,
                'notes' => $validated['notes'] ?? $devis->notes,
            ]);

            foreach ($devis->lignes as $ligne) {
                $commande->lignes()->create([
                    'description' => $ligne->description,
                    'quantite' => $ligne->quantite,
                    'prix_unitaire_ht' => $ligne->prix_unitaire_ht,
                    'montant_ht' => $ligne->montant_ht,
                ]);
            }

            $devis->update(['statut' => 'converti']);

            return $commande;
        });

        $commande->load(['client', 'lignes']);

        return response()->json($commande, 201);
    }

    public function commandeEnFacture(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'date_facture' => 'nullable|date',
            'date_echeance' => 'nullable|date|after_or_equal:date_facture',
            'statut' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $numeroFacture = 'FAC-' . date('Y') . '-' . str_pad(Facture::count() + 1, 4, '0', STR_PAD_LEFT);

        $facture = DB::transaction(function () use ($commande, $validated, $numeroFacture) {
            $dateFacture = $validated['date_facture'] ?? now();

            $facture = Facture::create([
                'numero_facture' => $numeroFacture,
                'client_id' => $commande->client_id,
                'commande_id' => $commande->id,
                'date_facture' => $dateFacture,
                'date_echeance' => $validated['date_echeance'] ?? $dateFacture->copy()->addDays(30),
                'statut' => $validated['statut'] ?? 'brouillon',
                'montant_ht' => $commande->montant_ht,
                'montant_tva' => $commande->montant_tva,
                'montant_ttc' => $commande->montant_ttc,
                'notes' => $validated['notes'] ?? $commande->notes,
            ]);

            foreach ($commande->lignes as $ligne) {
                $facture->lignes()->create([
                    'description' => $ligne->description,
                    'quantite' => $ligne->quantite,
                    'prix_unitaire_ht' => $ligne->prix_unitaire_ht,
                    'montant_ht' => $ligne->montant_ht,
                ]);
            }

            $commande->update(['statut' => 'facturee']);

            return $facture;
        });

        $facture->load(['client', 'commande', 'lignes']);

        return response()->json($facture, 201);
    }

    public function commandeEnBonDeCommande(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'date_bc' => 'nullable|date',
            'date_livraison_prevue' => 'nullable|date|after_or_equal:date_bc',
            'statut' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $existing = BonDeCommande::where('commande_id', $commande->id)
            ->where('fournisseur_id', $validated['fournisseur_id'])
            ->first();
        if ($existing) {
            return response()->json([
                'message' => 'Un bon de commande existe déjà pour ce fournisseur sur cette commande.'
            ], 409);
        }

        $numeroBc = 'BC-' . date('Y') . '-' . str_pad(BonDeCommande::count() + 1, 4, '0', STR_PAD_LEFT);

        $bon = DB::transaction(function () use ($commande, $validated, $numeroBc) {
            $bon = BonDeCommande::create([
                'numero_bc' => $numeroBc,
                'commande_id' => $commande->id,
                'fournisseur_id' => $validated['fournisseur_id'],
                'date_bc' => $validated['date_bc'] ?? now(),
                'date_livraison_prevue' => $validated['date_livraison_prevue'] ?? null,
                'statut' => $validated['statut'] ?? 'brouillon',
                'montant_ht' => $commande->montant_ht,
                'montant_tva' => $commande->montant_tva,
                'montant_ttc' => $commande->montant_ttc,
                'notes' => $validated['notes'] ?? $commande->notes,
            ]);

            foreach ($commande->lignes as $ligne) {
                $bon->lignes()->create([
                    'description' => $ligne->description,
                    'quantite' => $ligne->quantite,
                    'prix_unitaire_ht' => $ligne->prix_unitaire_ht,
                    'montant_ht' => $ligne->montant_ht,
                ]);
            }

            return $bon;
        });

        $bon->load(['fournisseur', 'lignes']);

        return response()->json($bon, 201);
    }

    public function facturePaiement(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'date_paiement' => 'required|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['facture_id'] = $facture->id;

        $paiement = Paiement::create($validated);

        $totalPaye = Paiement::where('facture_id', $facture->id)->sum('montant');

        if ($totalPaye >= $facture->montant_ttc) {
            $facture->update(['statut' => 'payee']);
        } elseif ($totalPaye > 0) {
            $facture->update(['statut' => 'partiellement_payee']);
        }

        $paiement->load('facture');

        return response()->json($paiement, 201);
    }

    public function marquerPayee(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'date_paiement' => 'nullable|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($facture, $validated) {
            $facture->update(['statut' => 'payee']);

            Paiement::create([
                'facture_id' => $facture->id,
                'montant' => $facture->montant_ttc,
                'date_paiement' => $validated['date_paiement'] ?? now(),
                'mode_paiement' => $validated['mode_paiement'] ?? 'virement',
                'reference' => $validated['reference'] ?? null,
            ]);
        });

        $facture->load('client');

        return response()->json($facture);
    }
}
