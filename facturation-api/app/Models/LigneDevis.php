<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneDevis extends Model
{
    protected $fillable = [
        'devis_id',
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

    public function devis(): BelongsTo
    {
        return $this->belongsTo(Devis::class);
    }
}
