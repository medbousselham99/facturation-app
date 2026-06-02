<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentSequence extends Model
{
    protected $fillable = [
        'type_document',
        'prefixe',
        'suffixe',
        'annee',
        'dernier_numero',
    ];

    protected function casts(): array
    {
        return [
            'annee' => 'integer',
            'dernier_numero' => 'integer',
        ];
    }
}
