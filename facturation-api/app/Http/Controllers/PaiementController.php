<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaiementRequest;
use App\Http\Requests\UpdatePaiementRequest;
use App\Models\Facture;
use App\Models\Paiement;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::with('facture:id,numero_facture')
            ->when(request('facture_id'), fn($q, $id) => $q->where('facture_id', $id))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($paiements);
    }

    public function store(StorePaiementRequest $request)
    {
        $validated = $request->validated();

        $facture = Facture::findOrFail($validated['facture_id']);
        $restant = $facture->montant_restant;

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

    public function update(UpdatePaiementRequest $request, Paiement $paiement)
    {
        $validated = $request->validated();

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

        if (isset($validated['facture_id']) || isset($validated['montant'])) {
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

        match (true) {
            $totalPaye >= $facture->montant_ttc => $facture->statut = 'payee',
            $totalPaye > 0 => $facture->statut = 'partiellement_payee',
            default => null,
        };

        $facture->save();
    }
}
