<?php

namespace App\Http\Controllers;

use App\Models\BonDeCommande;
use Illuminate\Http\Request;

class BonDeCommandeController extends Controller
{
    public function index()
    {
        $bons = BonDeCommande::with('fournisseur:id,nom')->get();

        return response()->json($bons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'date_bc' => 'required|date',
            'date_livraison_prevue' => 'nullable|date|after_or_equal:date_bc',
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

        $numeroBc = 'BC-' . date('Y') . '-' . str_pad(BonDeCommande::count() + 1, 4, '0', STR_PAD_LEFT);
        $validated['numero_bc'] = $numeroBc;

        $bon = BonDeCommande::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $bon->lignes()->create($ligne);
            }
        }

        $bon->load('lignes');

        return response()->json($bon, 201);
    }

    public function show($id)
    {
        $bonDeCommande = BonDeCommande::with(['fournisseur', 'commande', 'lignes'])->findOrFail($id);

        return response()->json($bonDeCommande);
    }

    public function update(Request $request, $id)
    {
        $bonDeCommande = BonDeCommande::findOrFail($id);

        $validated = $request->validate([
            'fournisseur_id' => 'sometimes|required|exists:fournisseurs,id',
            'date_bc' => 'sometimes|required|date',
            'date_livraison_prevue' => 'nullable|date|after_or_equal:date_bc',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $bonDeCommande->update($validated);

        return response()->json($bonDeCommande);
    }

    public function destroy($id)
    {
        $bonDeCommande = BonDeCommande::findOrFail($id);
        $bonDeCommande->delete();

        return response()->json(null, 204);
    }

    public function livrer($id)
    {
        $bonDeCommande = BonDeCommande::findOrFail($id);
        $bonDeCommande->update(['statut' => 'livre']);

        return response()->json($bonDeCommande->fresh()->load('fournisseur', 'commande', 'lignes'));
    }
}
