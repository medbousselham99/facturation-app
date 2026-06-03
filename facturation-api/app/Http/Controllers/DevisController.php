<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDevisRequest;
use App\Http\Requests\UpdateDevisRequest;
use App\Models\Devis;
use App\Models\DocumentSequence;
use App\Models\Historique;

class DevisController extends Controller
{
    public function index()
    {
        $devis = Devis::with('client:id,nom')
            ->when(request('search'), fn($q, $s) => $q->where('numero_devis', 'like', "%{$s}%"))
            ->when(request('statut'), fn($q, $s) => $q->where('statut', $s))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($devis);
    }

    public function store(StoreDevisRequest $request)
    {
        $validated = $request->validated();

        $validated['numero_devis'] = $this->nextNumero('devis', 'DEV-');

        if ($request->has('lignes')) {
            $montantHt = collect($request->lignes)->sum('montant_ht');
            $validated['montant_ht'] = $montantHt;
            $validated['montant_tva'] = $montantHt * 0.20;
            $validated['montant_ttc'] = $montantHt + ($montantHt * 0.20);
        }

        $devis = Devis::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $devis->lignes()->create($ligne);
            }
        }

        $devis->load('lignes');

        return response()->json($devis, 201);
    }

    public function show(Devis $devis)
    {
        $devis->load(['client', 'lignes']);

        return response()->json($devis);
    }

    public function update(UpdateDevisRequest $request, Devis $devis)
    {
        $devis->update($request->validated());

        return response()->json($devis);
    }

    public function destroy(Devis $devis)
    {
        $devis->delete();

        return response()->json(null, 204);
    }

    public function pdf(Devis $devis)
    {
        $devis->load(['client', 'lignes']);
        $params = \App\Models\ParametreEntreprise::first();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.devis', compact('devis', 'params'));

        return $pdf->download("devis_{$devis->numero_devis}.pdf");
    }

    public function envoyer(Devis $devis)
    {
        $devis->update(['statut' => 'envoye']);

        Historique::create([
            'document_type' => 'devis',
            'document_id' => $devis->id,
            'action' => 'envoye',
            'description' => 'Devis marqué comme envoyé',
        ]);

        return response()->json($devis->fresh());
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
