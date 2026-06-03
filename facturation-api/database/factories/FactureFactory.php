<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Facture;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactureFactory extends Factory
{
    protected $model = Facture::class;

    public function definition(): array
    {
        $ht = fake()->randomFloat(2, 100, 5000);
        $tva = $ht * 0.20;

        return [
            'client_id' => Client::factory(),
            'numero_facture' => 'FAC-' . date('Y') . '-' . fake()->unique()->numberBetween(1, 9999),
            'date_facture' => fake()->dateTimeBetween('-6 months'),
            'date_echeance' => fake()->dateTimeBetween('now', '+3 months'),
            'statut' => fake()->randomElement(['brouillon', 'en_attente', 'payee']),
            'montant_ht' => $ht,
            'montant_tva' => $tva,
            'montant_ttc' => $ht + $tva,
        ];
    }
}
