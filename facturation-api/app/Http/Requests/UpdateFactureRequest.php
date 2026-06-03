<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFactureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'sometimes|required|exists:clients,id',
            'commande_id' => 'nullable|exists:commandes,id',
            'devis_id' => 'nullable|exists:devis,id',
            'date_facture' => 'sometimes|required|date',
            'date_echeance' => 'sometimes|required|date|after_or_equal:date_facture',
            'statut' => 'nullable|string|max:50',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
