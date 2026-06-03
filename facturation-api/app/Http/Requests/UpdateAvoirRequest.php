<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvoirRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'facture_id' => 'nullable|exists:factures,id',
            'client_id' => 'sometimes|required|exists:clients,id',
            'date_avoir' => 'sometimes|required|date',
            'motif' => 'nullable|string|max:500',
            'montant_ht' => 'nullable|numeric|min:0',
            'montant_tva' => 'nullable|numeric|min:0',
            'montant_ttc' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ];
    }
}
