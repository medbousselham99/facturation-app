<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Facture;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index(Request $request)
    {
        $query = Paiement::with('facture:id,numero_facture');

        if ($factureId = $request->get('facture_id')) {
            $query->where('facture_id', $factureId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'facture_id' => 'required|exists:factures,id',
            'montant' => 'required|numeric|min:0.01',
            'date_paiement' => 'required|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $facture = Facture::findOrFail($validated['facture_id']);
        $totalPaye = Paiement::where('facture_id', $facture->id)->sum('montant');
        $restant = $facture->montant_ttc - $totalPaye;

        if ($validated['montant'] > $restant) {
            return response()->json([
                'message' => "Le montant saisi ({$validated['montant']} DH) dépasse le reste dû ({$restant} DH)."
            ], 422);
        }

        $paiement = Paiement::create($validated);

        $this->mettreAJourStatutFacture($validated['facture_id']);

        $paiement->load('facture:id,numero_facture');

        return response()->json($paiement, 201);
    }

    public function show(Paiement $paiement)
    {
        $paiement->load('facture');

        return response()->json($paiement);
    }

    public function update(Request $request, Paiement $paiement)
    {
        $validated = $request->validate([
            'facture_id' => 'sometimes|required|exists:factures,id',
            'montant' => 'sometimes|required|numeric|min:0.01',
            'date_paiement' => 'sometimes|required|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $factureId = $validated['facture_id'] ?? $paiement->facture_id;
        $facture = Facture::findOrFail($factureId);
        $totalPaye = Paiement::where('facture_id', $facture->id)
            ->where('id', '!=', $paiement->id)
            ->sum('montant');
        $montant = $validated['montant'] ?? $paiement->montant;
        $restant = $facture->montant_ttc - $totalPaye;

        if ($montant > $restant) {
            return response()->json([
                'message' => "Le montant saisi ({$montant} DH) dépasse le reste dû ({$restant} DH)."
            ], 422);
        }

        $paiement->update($validated);

        if ($request->has('facture_id') || $request->has('montant')) {
            $this->mettreAJourStatutFacture($paiement->facture_id);
        }

        return response()->json($paiement);
    }

    public function destroy(Paiement $paiement)
    {
        $factureId = $paiement->facture_id;

        $paiement->delete();

        $this->mettreAJourStatutFacture($factureId);

        return response()->json(null, 204);
    }

    private function mettreAJourStatutFacture(int $factureId): void
    {
        $facture = Facture::find($factureId);
        if (!$facture) {
            return;
        }

        $totalPaye = Paiement::where('facture_id', $factureId)->sum('montant');

        if ($totalPaye >= $facture->montant_ttc) {
            $facture->statut = 'payee';
        } elseif ($totalPaye > 0) {
            $facture->statut = 'partiellement_payee';
        }

        $facture->save();
    }
}
