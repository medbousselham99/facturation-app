<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Avoir extends Model
{
    protected $fillable = [
        'numero_avoir',
        'facture_id',
        'client_id',
        'date_avoir',
        'motif',
        'montant_ht',
        'montant_tva',
        'montant_ttc',
        'statut',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_avoir' => 'date',
            'montant_ht' => 'decimal:2',
            'montant_tva' => 'decimal:2',
            'montant_ttc' => 'decimal:2',
        ];
    }

    public function facture(): BelongsTo
    {
        return $this->belongsTo(Facture::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneAvoir::class);
    }
}
