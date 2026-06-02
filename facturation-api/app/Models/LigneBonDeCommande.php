<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneBonDeCommande extends Model
{
    protected $table = 'ligne_bons_de_commande';

    protected $fillable = [
        'bon_commande_id',
        'description',
        'quantite',
        'prix_unitaire_ht',
        'montant_ht',
    ];

    protected function casts(): array
    {
        return [
            'quantite' => 'integer',
            'prix_unitaire_ht' => 'decimal:2',
            'montant_ht' => 'decimal:2',
        ];
    }

    public function bonDeCommande(): BelongsTo
    {
        return $this->belongsTo(BonDeCommande::class, 'bon_commande_id');
    }
}
