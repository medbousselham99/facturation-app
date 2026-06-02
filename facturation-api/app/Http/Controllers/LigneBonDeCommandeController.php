<?php

namespace App\Http\Controllers;

use App\Models\LigneBonDeCommande;
use Illuminate\Http\Request;

class LigneBonDeCommandeController extends Controller
{
    public function index(Request $request)
    {
        $query = LigneBonDeCommande::query();

        if ($bonCommandeId = $request->get('bon_commande_id')) {
            $query->where('bon_commande_id', $bonCommandeId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bon_commande_id' => 'required|exists:bons_de_commande,id',
            'description' => 'required|string|max:500',
            'quantite' => 'required|integer|min:1',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligne = LigneBonDeCommande::create($validated);

        return response()->json($ligne, 201);
    }

    public function show($id)
    {
        return response()->json(LigneBonDeCommande::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $ligne = LigneBonDeCommande::findOrFail($id);

        $validated = $request->validate([
            'bon_commande_id' => 'sometimes|required|exists:bons_de_commande,id',
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
        LigneBonDeCommande::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
