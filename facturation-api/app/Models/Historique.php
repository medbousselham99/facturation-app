<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Historique extends Model
{
    protected $fillable = [
        'action',
        'description',
        'utilisateur',
        'model_type',
        'model_id',
        'donnees',
    ];

    protected function casts(): array
    {
        return [
            'donnees' => 'array',
        ];
    }

    public function historiqueable(): MorphTo
    {
        return $this->morphTo();
    }
}
