<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index()
    {
        $factures = Facture::with('client:id,nom')->get();

        return response()->json($factures);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'commande_id' => 'nullable|exists:commandes,id',
            'devis_id' => 'nullable|exists:devis,id',
            'date_facture' => 'required|date',
            'date_echeance' => 'required|date|after_or_equal:date_facture',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'lignes' => 'nullable|array',
            'lignes.*.description' => 'required_with:lignes|string|max:500',
            'lignes.*.quantite' => 'required_with:lignes|integer|min:1',
            'lignes.*.prix_unitaire_ht' => 'required_with:lignes|numeric|min:0',
            'lignes.*.montant_ht' => 'nullable|numeric|min:0',
        ]);

        $numeroFacture = 'FAC-' . date('Y') . '-' . str_pad(Facture::count() + 1, 4, '0', STR_PAD_LEFT);
        $validated['numero_facture'] = $numeroFacture;

        if ($request->has('lignes')) {
            $montantHt = collect($request->lignes)->sum('montant_ht');
            $validated['montant_ht'] = $montantHt;
            $validated['montant_tva'] = $montantHt * 0.20;
            $validated['montant_ttc'] = $montantHt + ($montantHt * 0.20);
        }

        $facture = Facture::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $facture->lignes()->create($ligne);
            }
        }

        $facture->load('lignes');

        return response()->json($facture, 201);
    }

    public function show(Facture $facture)
    {
        $facture->load(['client', 'commande', 'devis', 'lignes']);

        return response()->json($facture);
    }

    public function update(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'commande_id' => 'nullable|exists:commandes,id',
            'devis_id' => 'nullable|exists:devis,id',
            'date_facture' => 'sometimes|required|date',
            'date_echeance' => 'sometimes|required|date|after_or_equal:date_facture',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $facture->update($validated);

        return response()->json($facture);
    }

    public function destroy(Facture $facture)
    {
        $facture->delete();

        return response()->json(null, 204);
    }

    public function pdf(Facture $facture)
    {
        $facture->load(['client', 'lignes']);
        $params = \App\Models\ParametreEntreprise::first();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.facture', [
            'facture' => $facture,
            'params' => $params,
        ]);

        return $pdf->download("facture_{$facture->numero_facture}.pdf");
    }

    public function envoyerEmail(Facture $facture)
    {
        $facture->load('client');
        $params = \App\Models\ParametreEntreprise::first();

        try {
            \Illuminate\Support\Facades\Mail::send('emails.facture', [
                'facture' => $facture,
                'params' => $params,
            ], function ($message) use ($facture, $params) {
                $message->to($facture->client->email, $facture->client->nom)
                        ->subject($params->email_objet_facture ?? "Facture {$facture->numero_facture}");
            });

            \App\Models\Historique::create([
                'document_type' => 'facture',
                'document_id' => $facture->id,
                'action' => 'envoye',
                'description' => "Email envoyé à {$facture->client->email}",
            ]);

            return response()->json(['message' => 'Email envoyé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de l\'envoi: ' . $e->getMessage()], 500);
        }
    }

    public function payer(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'date_paiement' => 'nullable|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($facture, $validated) {
            $facture->update(['statut' => 'payee']);
            \App\Models\Paiement::create([
                'facture_id' => $facture->id,
                'montant' => $facture->montant_ttc,
                'date_paiement' => $validated['date_paiement'] ?? now(),
                'mode_paiement' => $validated['mode_paiement'] ?? 'virement',
                'reference' => $validated['reference'] ?? null,
            ]);
        });

        \App\Models\Historique::create([
            'document_type' => 'facture',
            'document_id' => $facture->id,
            'action' => 'paye',
            'description' => 'Facture marquée comme payée',
        ]);

        return response()->json($facture->fresh()->load('client'));
    }
}
