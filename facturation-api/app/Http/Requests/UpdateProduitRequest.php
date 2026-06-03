<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProduitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $produit = $this->route('produit');

        return [
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'prix_unitaire_ht' => 'sometimes|required|numeric|min:0',
            'tva_taux' => 'nullable|numeric|min:0|max:100',
            'unite' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:100|unique:produits,reference,' . ($produit->id ?? $produit),
            'actif' => 'nullable|boolean',
        ];
    }
}
