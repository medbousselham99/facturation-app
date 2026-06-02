<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
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

    public function devis(): HasMany
    {
        return $this->hasMany(Devis::class);
    }

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }

    public function factures(): HasMany
    {
        return $this->hasMany(Facture::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function avoirs(): HasMany
    {
        return $this->hasMany(Avoir::class);
    }
}
