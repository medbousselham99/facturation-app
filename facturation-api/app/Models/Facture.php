<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facture extends Model
{
    protected $fillable = [
        'numero_facture',
        'client_id',
        'commande_id',
        'devis_id',
        'date_facture',
        'date_echeance',
        'statut',
        'montant_ht',
        'montant_tva',
        'montant_ttc',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_facture' => 'date',
            'date_echeance' => 'date',
            'montant_ht' => 'decimal:2',
            'montant_tva' => 'decimal:2',
            'montant_ttc' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function devis(): BelongsTo
    {
        return $this->belongsTo(Devis::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneFacture::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function avoirs(): HasMany
    {
        return $this->hasMany(Avoir::class);
    }

    public function getMontantRestantAttribute(): float
    {
        $totalPaye = $this->paiements()->sum('montant');
        return max(0, $this->montant_ttc - $totalPaye);
    }
}
