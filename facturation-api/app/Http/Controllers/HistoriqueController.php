<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    public function index()
    {
        $historiques = Historique::query()
            ->when(request('document_type'), fn($q, $v) => $q->where('document_type', $v))
            ->when(request('document_id'), fn($q, $v) => $q->where('document_id', $v))
            ->latest()
            ->paginate(request('per_page', 10));

        return response()->json($historiques);
    }

    public function forDocument(string $documentType, int $documentId)
    {
        $historiques = Historique::where('document_type', $documentType)
            ->where('document_id', $documentId)
            ->latest()
            ->get();

        return response()->json($historiques);
    }
}
