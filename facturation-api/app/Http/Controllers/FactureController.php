<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFactureRequest;
use App\Http\Requests\UpdateFactureRequest;
use App\Models\DocumentSequence;
use App\Models\Facture;
use App\Models\Historique;
use App\Models\Paiement;
use App\Models\ParametreEntreprise;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class FactureController extends Controller
{
    public function index()
    {
        $factures = Facture::with('client:id,nom')
            ->when(request('search'), fn($q, $s) => $q->where('numero_facture', 'like', "%{$s}%"))
            ->when(request('statut'), fn($q, $s) => $q->where('statut', $s))
            ->when(request('date_debut'), fn($q, $d) => $q->where('date_facture', '>=', $d))
            ->when(request('date_fin'), fn($q, $d) => $q->where('date_facture', '<=', $d))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($factures);
    }

    public function store(StoreFactureRequest $request)
    {
        $validated = $request->validated();

        $validated['numero_facture'] = $this->nextNumero('facture', 'FAC-');

        if ($request->has('lignes')) {
            $montantHt = collect($request->lignes)->sum('montant_ht');
            $validated['montant_ht'] = $montantHt;
            $validated['montant_tva'] = $montantHt * 0.20;
            $validated['montant_ttc'] = $montantHt + ($montantHt * 0.20);
        }

        $facture = Facture::create($validated);

        if ($request->has('lignes')) {
            foreach ($request->lignes as $ligne) {
                $facture->lignes()->create($ligne);
            }
        }

        $facture->load('lignes');

        return response()->json($facture, 201);
    }

    public function show(Facture $facture)
    {
        $facture->load(['client', 'commande', 'devis', 'lignes']);

        return response()->json($facture);
    }

    public function update(UpdateFactureRequest $request, Facture $facture)
    {
        $facture->update($request->validated());

        return response()->json($facture);
    }

    public function destroy(Facture $facture)
    {
        $facture->delete();

        return response()->json(null, 204);
    }

    public function pdf(Facture $facture)
    {
        $facture->load(['client', 'lignes']);
        $params = ParametreEntreprise::first();

        $pdf = Pdf::loadView('pdf.facture', compact('facture', 'params'));

        return $pdf->download("facture_{$facture->numero_facture}.pdf");
    }

    public function envoyerEmail(Facture $facture)
    {
        $facture->load('client');
        $params = ParametreEntreprise::first();

        try {
            Mail::send('emails.facture', compact('facture', 'params'), function ($message) use ($facture, $params) {
                $message->to($facture->client->email, $facture->client->nom)
                        ->subject($params->email_objet_facture ?? "Facture {$facture->numero_facture}");
            });

            Historique::create([
                'document_type' => 'facture',
                'document_id' => $facture->id,
                'action' => 'envoye',
                'description' => "Email envoyé à {$facture->client->email}",
            ]);

            return response()->json(['message' => 'Email envoyé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de l\'envoi: ' . $e->getMessage()], 500);
        }
    }

    public function payer(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'date_paiement' => 'nullable|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($facture, $validated) {
            $facture->update(['statut' => 'payee']);
            Paiement::create([
                'facture_id' => $facture->id,
                'montant' => $facture->montant_ttc,
                'date_paiement' => $validated['date_paiement'] ?? now(),
                'mode_paiement' => $validated['mode_paiement'] ?? 'virement',
                'reference' => $validated['reference'] ?? null,
            ]);
        });

        Historique::create([
            'document_type' => 'facture',
            'document_id' => $facture->id,
            'action' => 'paye',
            'description' => 'Facture marquée comme payée',
        ]);

        return response()->json($facture->fresh()->load('client'));
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
