<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentSequence extends Model
{
    protected $fillable = [
        'document_type',
        'prefixe',
        'suffixe',
        'prochain_numero',
        'format_longueur',
        'annee_courante',
    ];

    protected function casts(): array
    {
        return [
            'prochain_numero' => 'integer',
            'format_longueur' => 'integer',
            'annee_courante' => 'string',
        ];
    }
}
