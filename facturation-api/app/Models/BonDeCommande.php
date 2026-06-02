<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BonDeCommande extends Model
{
    protected $table = 'bons_de_commande';

    protected $fillable = [
        'numero_bc',
        'commande_id',
        'fournisseur_id',
        'date_bc',
        'date_livraison_prevue',
        'statut',
        'montant_ht',
        'montant_tva',
        'montant_ttc',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_bc' => 'date',
            'date_livraison_prevue' => 'date',
            'montant_ht' => 'decimal:2',
            'montant_tva' => 'decimal:2',
            'montant_ttc' => 'decimal:2',
        ];
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneBonDeCommande::class, 'bon_commande_id');
    }
}
