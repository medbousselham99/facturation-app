<?php

namespace Database\Factories;

use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->words(2, true),
            'prix_unitaire_ht' => fake()->randomFloat(2, 10, 1000),
            'tva_taux' => 20,
            'actif' => true,
        ];
    }
}
