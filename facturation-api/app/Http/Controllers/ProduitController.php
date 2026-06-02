<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index(Request $request)
    {
        $query = Produit::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('actif')) {
            $query->where('actif', filter_var($request->actif, FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'tva_taux' => 'nullable|numeric|min:0|max:100',
            'unite' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:100|unique:produits,reference',
            'actif' => 'nullable|boolean',
        ]);

        $produit = Produit::create($validated);

        return response()->json($produit, 201);
    }

    public function show(Produit $produit)
    {
        return response()->json($produit);
    }

    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'prix_unitaire_ht' => 'sometimes|required|numeric|min:0',
            'tva_taux' => 'nullable|numeric|min:0|max:100',
            'unite' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:100|unique:produits,reference,' . $produit->id,
            'actif' => 'nullable|boolean',
        ]);

        $produit->update($validated);

        return response()->json($produit);
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();

        return response()->json(null, 204);
    }
}
