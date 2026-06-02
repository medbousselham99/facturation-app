<?php

namespace App\Http\Controllers;

use App\Models\Devis;
use Illuminate\Http\Request;

class DevisController extends Controller
{
    public function index()
    {
        $devis = Devis::with('client:id,nom')->get();

        return response()->json($devis);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'date_devis' => 'required|date',
            'date_validite' => 'required|date|after_or_equal:date_devis',
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

        $numeroDevis = 'DEV-' . date('Y') . '-' . str_pad(Devis::count() + 1, 4, '0', STR_PAD_LEFT);
        $validated['numero_devis'] = $numeroDevis;

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

    public function update(Request $request, Devis $devis)
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'date_devis' => 'sometimes|required|date',
            'date_validite' => 'sometimes|required|date|after_or_equal:date_devis',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $devis->update($validated);

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

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.devis', [
            'devis' => $devis,
            'params' => $params,
        ]);

        return $pdf->download("devis_{$devis->numero_devis}.pdf");
    }

    public function envoyer(Devis $devis)
    {
        $devis->update(['statut' => 'en_attente']);

        \App\Models\Historique::create([
            'document_type' => 'devis',
            'document_id' => $devis->id,
            'action' => 'envoye',
            'description' => 'Devis marqué comme envoyé',
        ]);

        return response()->json($devis);
    }
}
