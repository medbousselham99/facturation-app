<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Devis;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::with('client:id,nom')->get();

        return response()->json($commandes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'date_commande' => 'required|date',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'lignes' => 'nullable|array',
            'lignes.*.description' => 'required_with:lignes|string|max:500',
            'lignes.*.quantite' => 'required_with:lignes|integer|min:1',
            'lignes.*.prix_unitaire_ht' => 'required_with:lignes|numeric|min:0',
            'lignes.*.montant_ht' => 'nullable|numeric|min:0',
        ]);

        $numeroCommande = 'CMD-' . date('Y') . '-' . str_pad(Commande::withTrashed()->count() + 1, 4, '0', STR_PAD_LEFT);
        $validated['numero_commande'] = $numeroCommande;

        if ($request->has('lignes')) {
            $montantHt = collect($request->lignes)->sum('montant_ht');
            $validated['montant_ht'] = $montantHt;
            $validated['montant_tva'] = $montantHt * 0.20;
            $validated['montant_ttc'] = $montantHt + ($montantHt * 0.20);
        }

        $commande = Commande::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $commande->lignes()->create($ligne);
            }
        }

        $commande->load('lignes');

        return response()->json($commande, 201);
    }

    public function show(Commande $commande)
    {
        $commande->load(['client', 'lignes']);

        return response()->json($commande);
    }

    public function update(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'date_commande' => 'sometimes|required|date',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $commande->update($validated);

        return response()->json($commande);
    }

    public function destroy(Commande $commande)
    {
        if ($commande->devis_id) {
            Devis::where('id', $commande->devis_id)->update(['statut' => 'brouillon']);
        }

        $commande->delete();

        return response()->json(null, 204);
    }

    public function livrer(Commande $commande)
    {
        $commande->update(['statut' => 'livree']);

        return response()->json($commande->fresh()->load('client', 'lignes'));
    }
}
