<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_sequences', function (Blueprint $table) {
            $table->id();
            $table->string('document_type')->unique();
            $table->string('prefixe');
            $table->string('suffixe')->nullable();
            $table->integer('prochain_numero')->default(1);
            $table->integer('format_longueur')->default(4);
            $table->string('annee_courante', 4)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_sequences');
    }
};
