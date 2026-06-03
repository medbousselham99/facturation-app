<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'prix_unitaire_ht', 'tva_taux', 'unite', 'reference', 'actif'];

    protected function casts(): array
    {
        return [
            'prix_unitaire_ht' => 'decimal:2',
            'tva_taux' => 'decimal:2',
            'actif' => 'boolean',
        ];
    }
}
