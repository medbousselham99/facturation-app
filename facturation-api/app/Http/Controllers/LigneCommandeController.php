<?php

namespace App\Http\Controllers;

use App\Models\LigneCommande;
use Illuminate\Http\Request;

class LigneCommandeController extends Controller
{
    public function index(Request $request)
    {
        $query = LigneCommande::query();

        if ($commandeId = $request->get('commande_id')) {
            $query->where('commande_id', $commandeId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'commande_id' => 'required|exists:commandes,id',
            'description' => 'required|string|max:500',
            'quantite' => 'required|integer|min:1',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligne = LigneCommande::create($validated);

        return response()->json($ligne, 201);
    }

    public function show(LigneCommande $ligneCommande)
    {
        return response()->json($ligneCommande);
    }

    public function update(Request $request, LigneCommande $ligneCommande)
    {
        $validated = $request->validate([
            'commande_id' => 'sometimes|required|exists:commandes,id',
            'description' => 'sometimes|required|string|max:500',
            'quantite' => 'sometimes|required|integer|min:1',
            'prix_unitaire_ht' => 'sometimes|required|numeric|min:0',
            'montant_ht' => 'nullable|numeric|min:0',
        ]);

        $ligneCommande->update($validated);

        return response()->json($ligneCommande);
    }

    public function destroy(LigneCommande $ligneCommande)
    {
        $ligneCommande->delete();

        return response()->json(null, 204);
    }
}
