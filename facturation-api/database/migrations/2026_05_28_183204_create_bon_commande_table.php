<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bons_de_commande', function (Blueprint $table) {
            $table->id();
            $table->string('numero_bc')->unique();
            $table->foreignId('fournisseur_id')->constrained()->onDelete('cascade');
            $table->date('date_bc');
            $table->date('date_livraison_prevue')->nullable();
            $table->string('statut')->default('brouillon');
            $table->decimal('montant_ht', 10, 2)->default(0);
            $table->decimal('montant_tva', 10, 2)->default(0);
            $table->decimal('montant_ttc', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bons_de_commande');
    }
};
