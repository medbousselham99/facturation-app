<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'facture_id' => 'sometimes|required|exists:factures,id',
            'montant' => 'sometimes|required|numeric|min:0.01',
            'date_paiement' => 'sometimes|required|date',
            'mode_paiement' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
