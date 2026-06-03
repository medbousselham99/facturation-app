<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProduitRequest;
use App\Http\Requests\UpdateProduitRequest;
use App\Models\Produit;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::query()
            ->when(request('search'), fn($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")->orWhere('reference', 'like', "%{$s}%")->orWhere('description', 'like', "%{$s}%");
            }))
            ->when(request()->has('actif'), fn($q) => $q->where('actif', filter_var(request('actif'), FILTER_VALIDATE_BOOLEAN)))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($produits);
    }

    public function store(StoreProduitRequest $request)
    {
        $produit = Produit::create($request->validated());

        return response()->json($produit, 201);
    }

    public function show(Produit $produit)
    {
        return response()->json($produit);
    }

    public function update(UpdateProduitRequest $request, Produit $produit)
    {
        $produit->update($request->validated());

        return response()->json($produit);
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();

        return response()->json(null, 204);
    }
}
