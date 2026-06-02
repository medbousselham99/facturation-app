<?php

namespace App\Http\Controllers;

use App\Models\LigneFacture;
use Illuminate\Http\Request;

class LigneFactureController extends Controller
{
    public function index(Request $request)
    {
        $query = LigneFacture::query();

        if ($factureId = $request->get('facture_id')) {
            $query->where('facture_id', $factureId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'facture_id' => 'required|exists:factures,id',
            'description' => 'required|string|max:500',
            'quantite' => 'required|integer|min:1',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligne = LigneFacture::create($validated);

        return response()->json($ligne, 201);
    }

    public function show(LigneFacture $ligneFacture)
    {
        return response()->json($ligneFacture);
    }

    public function update(Request $request, LigneFacture $ligneFacture)
    {
        $validated = $request->validate([
            'facture_id' => 'sometimes|required|exists:factures,id',
            'description' => 'sometimes|required|string|max:500',
            'quantite' => 'sometimes|required|integer|min:1',
            'prix_unitaire_ht' => 'sometimes|required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligneFacture->update($validated);

        return response()->json($ligneFacture);
    }

    public function destroy(LigneFacture $ligneFacture)
    {
        $ligneFacture->delete();

        return response()->json(null, 204);
    }
}
