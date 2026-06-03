<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommandeRequest;
use App\Http\Requests\UpdateCommandeRequest;
use App\Models\Commande;
use App\Models\Devis;
use App\Models\DocumentSequence;

class CommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::with('client:id,nom')
            ->when(request('search'), fn($q, $s) => $q->where('numero_commande', 'like', "%{$s}%"))
            ->when(request('statut'), fn($q, $s) => $q->where('statut', $s))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($commandes);
    }

    public function store(StoreCommandeRequest $request)
    {
        $validated = $request->validated();

        $validated['numero_commande'] = $this->nextNumero('commande', 'CMD-');

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

    public function update(UpdateCommandeRequest $request, Commande $commande)
    {
        $commande->update($request->validated());

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
