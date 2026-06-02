<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ParametreEntreprise;
use App\Models\DocumentSequence;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        ParametreEntreprise::firstOrCreate(
            ['id' => 1],
            [
                'nom_entreprise' => 'Mon Entreprise',
                'adresse' => '123 Rue Example',
                'ville' => 'Paris',
                'code_postal' => '75001',
                'pays' => 'France',
                'siret' => '12345678900001',
                'email' => 'contact@monentreprise.fr',
                'telephone' => '01 23 45 67 89',
                'tva_taux_default' => 20.00,
                'delai_paiement_jours' => 30,
            ]
        );

        $sequences = [
            ['document_type' => 'devis', 'prefixe' => 'DEV-', 'annee_courante' => date('Y'), 'prochain_numero' => 1],
            ['document_type' => 'commande', 'prefixe' => 'CMD-', 'annee_courante' => date('Y'), 'prochain_numero' => 1],
            ['document_type' => 'bon_commande', 'prefixe' => 'BC-', 'annee_courante' => date('Y'), 'prochain_numero' => 1],
            ['document_type' => 'facture', 'prefixe' => 'FAC-', 'annee_courante' => date('Y'), 'prochain_numero' => 1],
            ['document_type' => 'avoir', 'prefixe' => 'AVOIR-', 'annee_courante' => date('Y'), 'prochain_numero' => 1],
        ];

        foreach ($sequences as $seq) {
            DocumentSequence::firstOrCreate(
                ['document_type' => $seq['document_type']],
                $seq
            );
        }
    }
}
