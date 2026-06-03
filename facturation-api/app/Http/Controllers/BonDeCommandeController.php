<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBonDeCommandeRequest;
use App\Http\Requests\UpdateBonDeCommandeRequest;
use App\Models\BonDeCommande;
use App\Models\DocumentSequence;

class BonDeCommandeController extends Controller
{
    public function index()
    {
        $bons = BonDeCommande::with('fournisseur:id,nom')
            ->when(request('search'), fn($q, $s) => $q->where('numero_bc', 'like', "%{$s}%"))
            ->when(request('statut'), fn($q, $s) => $q->where('statut', $s))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($bons);
    }

    public function store(StoreBonDeCommandeRequest $request)
    {
        $validated = $request->validated();

        $validated['numero_bc'] = $this->nextNumero('bon_commande', 'BC-');

        $bon = BonDeCommande::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $bon->lignes()->create($ligne);
            }
        }

        $bon->load('lignes');

        return response()->json($bon, 201);
    }

    public function show(BonDeCommande $bonDeCommande)
    {
        $bonDeCommande->load(['fournisseur', 'commande', 'lignes']);

        return response()->json($bonDeCommande);
    }

    public function update(UpdateBonDeCommandeRequest $request, BonDeCommande $bonDeCommande)
    {
        $bonDeCommande->update($request->validated());

        return response()->json($bonDeCommande);
    }

    public function destroy(BonDeCommande $bonDeCommande)
    {
        $bonDeCommande->delete();

        return response()->json(null, 204);
    }

    public function livrer(BonDeCommande $bonDeCommande)
    {
        $bonDeCommande->update(['statut' => 'livre']);

        return response()->json($bonDeCommande->fresh()->load('fournisseur', 'commande', 'lignes'));
    }

    private function nextNumero(string $type, string $prefix): string
    {
        $seq = DocumentSequence::firstOrCreate(
            ['document_type' => $type],
            ['prefixe' => $prefix, 'annee_courante' => date('Y'), 'prochain_numero' => 1]
        );

        if ($seq->annee_courante != date('Y')) {
            $seq->update(['annee_courante' => date('Y'), 'prochain_numero' => 1]);
        }

        $numero = $prefix . date('Y') . '-' . str_pad($seq->prochain_numero, 4, '0', STR_PAD_LEFT);
        $seq->increment('prochain_numero');

        return $numero;
    }
}
