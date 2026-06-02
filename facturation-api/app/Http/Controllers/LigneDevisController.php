<?php

namespace App\Http\Controllers;

use App\Models\LigneDevis;
use Illuminate\Http\Request;

class LigneDevisController extends Controller
{
    public function index(Request $request)
    {
        $query = LigneDevis::query();

        if ($devisId = $request->get('devis_id')) {
            $query->where('devis_id', $devisId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'devis_id' => 'required|exists:devis,id',
            'description' => 'required|string|max:500',
            'quantite' => 'required|integer|min:1',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligne = LigneDevis::create($validated);

        return response()->json($ligne, 201);
    }

    public function show($id)
    {
        return response()->json(LigneDevis::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $ligne = LigneDevis::findOrFail($id);

        $validated = $request->validate([
            'devis_id' => 'sometimes|required|exists:devis,id',
            'description' => 'sometimes|required|string|max:500',
            'quantite' => 'sometimes|required|integer|min:1',
            'prix_unitaire_ht' => 'sometimes|required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligne->update($validated);

        return response()->json($ligne);
    }

    public function destroy($id)
    {
        LigneDevis::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
