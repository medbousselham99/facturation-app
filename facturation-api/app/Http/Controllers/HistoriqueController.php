<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    public function index(Request $request)
    {
        $query = Historique::query();

        if ($documentType = $request->get('document_type')) {
            $query->where('model_type', $documentType);
        }

        if ($documentId = $request->get('document_id')) {
            $query->where('model_id', $documentId);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|max:100',
            'description' => 'nullable|string',
            'utilisateur' => 'nullable|string|max:255',
            'model_type' => 'required|string|max:255',
            'model_id' => 'required|integer',
            'donnees' => 'nullable|array',
        ]);

        $historique = Historique::create($validated);

        return response()->json($historique, 201);
    }

    public function forDocument(string $documentType, int $documentId)
    {
        $historiques = Historique::where('model_type', $documentType)
            ->where('model_id', $documentId)
            ->latest()
            ->get();

        return response()->json($historiques);
    }
}
