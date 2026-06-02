<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fournisseur extends Model
{
    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'adresse',
        'ville',
        'code_postal',
        'pays',
        'siret',
        'statut',
        'notes',
    ];

    public function bonsDeCommande(): HasMany
    {
        return $this->hasMany(BonDeCommande::class);
    }
}
