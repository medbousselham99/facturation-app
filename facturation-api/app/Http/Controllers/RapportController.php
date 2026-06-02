<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RapportController extends Controller
{
    private function getDateFilter(Request $request)
    {
        $validated = $request->validate([
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
        ]);

        $query = Facture::query();

        if ($request->filled('date_debut')) {
            $query->where('date_facture', '>=', $request->date_debut);
        }

        if ($request->filled('date_fin')) {
            $query->where('date_facture', '<=', $request->date_fin);
        }

        return $query;
    }

    public function ventes(Request $request)
    {
        $query = $this->getDateFilter($request);
        $query->where('statut', 'payee');

        $totalVentes = (float) $query->sum('montant_ttc');
        $totalFactures = $query->count();

        $topClients = Client::select('clients.id', 'clients.nom')
            ->selectRaw('COALESCE(SUM(factures.montant_ttc), 0) as total_achats')
            ->selectRaw('COUNT(factures.id) as nombre_factures')
            ->leftJoin('factures', function ($join) use ($request) {
                $join->on('clients.id', '=', 'factures.client_id')
                     ->where('factures.statut', 'payee');
                if ($request->filled('date_debut')) {
                    $join->where('factures.date_facture', '>=', $request->date_debut);
                }
                if ($request->filled('date_fin')) {
                    $join->where('factures.date_facture', '<=', $request->date_fin);
                }
            })
            ->groupBy('clients.id', 'clients.nom')
            ->orderByDesc('total_achats')
            ->take(5)
            ->get()
            ->toArray();

        $data = [
            'total_ventes' => $totalVentes,
            'total_factures' => $totalFactures,
            'top_clients' => $topClients,
        ];

        if ($request->export === 'pdf' || $request->export === 'excel') {
            return response()->json($data);
        }

        return response()->json($data);
    }

    public function tva(Request $request)
    {
        $query = $this->getDateFilter($request);
        $query->where('statut', 'payee');

        $totalTva = (float) $query->sum('montant_tva');

        $data = [
            'tva_collectee' => $totalTva,
            'nombre_factures' => $query->count(),
            'montant_ht' => (float) $query->sum('montant_ht'),
            'montant_ttc' => (float) $query->sum('montant_ttc'),
        ];

        if ($request->export === 'pdf' || $request->export === 'excel') {
            return response()->json($data);
        }

        return response()->json($data);
    }

    public function topClients(Request $request)
    {
        $query = Client::select('clients.id', 'clients.nom', 'clients.email')
            ->selectRaw('COALESCE(SUM(factures.montant_ttc), 0) as total_ca')
            ->selectRaw('COUNT(factures.id) as nombre_factures')
            ->leftJoin('factures', function ($join) use ($request) {
                $join->on('clients.id', '=', 'factures.client_id')
                     ->where('factures.statut', 'payee');
                if ($request->filled('date_debut')) {
                    $join->where('factures.date_facture', '>=', $request->date_debut);
                }
                if ($request->filled('date_fin')) {
                    $join->where('factures.date_facture', '<=', $request->date_fin);
                }
            })
            ->groupBy('clients.id', 'clients.nom', 'clients.email')
            ->orderByDesc('total_ca')
            ->take(5)
            ->get()
            ->toArray();

        $data = [
            'top_clients' => $query,
        ];

        if ($request->export === 'pdf' || $request->export === 'excel') {
            return response()->json($data);
        }

        return response()->json($data);
    }
}
