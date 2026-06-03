<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProduitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'tva_taux' => 'nullable|numeric|min:0|max:100',
            'unite' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:100|unique:produits,reference',
            'actif' => 'nullable|boolean',
        ];
    }
}
