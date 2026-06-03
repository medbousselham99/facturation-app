<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use App\Models\Fournisseur;

class FournisseurController extends Controller
{
    public function index()
    {
        $fournisseurs = Fournisseur::query()
            ->when(request('search'), fn($q, $s) => $q->where('nom', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($fournisseurs);
    }

    public function store(StoreFournisseurRequest $request)
    {
        $fournisseur = Fournisseur::create($request->validated());

        return response()->json($fournisseur, 201);
    }

    public function show(Fournisseur $fournisseur)
    {
        $fournisseur->loadCount('bonsDeCommande');

        return response()->json($fournisseur);
    }

    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur)
    {
        $fournisseur->update($request->validated());

        return response()->json($fournisseur);
    }

    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();

        return response()->json(null, 204);
    }
}
