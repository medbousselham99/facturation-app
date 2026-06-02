<?php

namespace App\Http\Controllers;

use App\Models\Avoir;
use Illuminate\Http\Request;

class AvoirController extends Controller
{
    public function index()
    {
        $avoirs = Avoir::with('client:id,nom')->get();

        return response()->json($avoirs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'facture_id' => 'nullable|exists:factures,id',
            'client_id' => 'required|exists:clients,id',
            'date_avoir' => 'required|date',
            'motif' => 'nullable|string|max:500',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'lignes' => 'nullable|array',
            'lignes.*.description' => 'required_with:lignes|string|max:500',
            'lignes.*.quantite' => 'required_with:lignes|integer|min:1',
            'lignes.*.prix_unitaire_ht' => 'required_with:lignes|numeric|min:0',
            'lignes.*.montant_ht' => 'nullable|numeric|min:0',
        ]);

        $numeroAvoir = 'AVOIR-' . date('Y') . '-' . str_pad(Avoir::count() + 1, 4, '0', STR_PAD_LEFT);
        $validated['numero_avoir'] = $numeroAvoir;

        $avoir = Avoir::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $avoir->lignes()->create($ligne);
            }
        }

        $avoir->load(['client', 'lignes']);

        return response()->json($avoir, 201);
    }

    public function show(Avoir $avoir)
    {
        $avoir->load(['client', 'facture', 'lignes']);

        return response()->json($avoir);
    }

    public function update(Request $request, Avoir $avoir)
    {
        $validated = $request->validate([
            'facture_id' => 'nullable|exists:factures,id',
            'client_id' => 'sometimes|required|exists:clients,id',
            'date_avoir' => 'sometimes|required|date',
            'motif' => 'nullable|string|max:500',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $avoir->update($validated);

        return response()->json($avoir);
    }

    public function destroy(Avoir $avoir)
    {
        $avoir->delete();

        return response()->json(null, 204);
    }
}
