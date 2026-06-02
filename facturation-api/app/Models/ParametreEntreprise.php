<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParametreEntreprise extends Model
{
    protected $table = 'parametres_entreprise';

    protected $fillable = [
        'nom_entreprise',
        'devise',
        'logo',
        'adresse',
        'ville',
        'code_postal',
        'pays',
        'siret',
        'ice',
        'email',
        'telephone',
        'rib',
        'tva_taux_default',
        'delai_paiement_jours',
        'email_expediteur',
        'email_objet_devis',
        'email_objet_facture',
        'email_corps_devis',
        'email_corps_facture',
    ];

    protected function casts(): array
    {
        return [
            'tva_taux_default' => 'decimal:2',
            'delai_paiement_jours' => 'integer',
        ];
    }
}
