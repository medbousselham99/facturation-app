<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAvoirRequest;
use App\Http\Requests\UpdateAvoirRequest;
use App\Models\Avoir;
use App\Models\DocumentSequence;

class AvoirController extends Controller
{
    public function index()
    {
        $avoirs = Avoir::with('client:id,nom')
            ->when(request('search'), fn($q, $s) => $q->where('numero_avoir', 'like', "%{$s}%"))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($avoirs);
    }

    public function store(StoreAvoirRequest $request)
    {
        $validated = $request->validated();

        $validated['numero_avoir'] = $this->nextNumero('avoir', 'AVOIR-');

        $avoir = Avoir::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $avoir->lignes()->create($ligne);
            }
        }

        $avoir->load(['client', 'lignes']);

        return response()->json($avoir, 201);
    }

    public function show(Avoir $avoir)
    {
        $avoir->load(['client', 'facture', 'lignes']);

        return response()->json($avoir);
    }

    public function update(UpdateAvoirRequest $request, Avoir $avoir)
    {
        $avoir->update($request->validated());

        return response()->json($avoir);
    }

    public function destroy(Avoir $avoir)
    {
        $avoir->delete();

        return response()->json(null, 204);
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
