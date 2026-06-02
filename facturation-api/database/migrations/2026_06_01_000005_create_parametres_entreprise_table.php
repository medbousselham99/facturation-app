<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parametres_entreprise', function (Blueprint $table) {
            $table->id();
            $table->string('nom_entreprise');
            $table->text('logo')->nullable();
            $table->text('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('code_postal')->nullable();
            $table->string('pays')->nullable();
            $table->string('siret')->nullable();
            $table->string('ice')->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->text('rib')->nullable();
            $table->decimal('tva_taux_default', 5, 2)->default(20.00);
            $table->integer('delai_paiement_jours')->default(30);
            $table->string('email_expediteur')->nullable();
            $table->text('email_objet_devis')->nullable();
            $table->text('email_objet_facture')->nullable();
            $table->text('email_corps_devis')->nullable();
            $table->text('email_corps_facture')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parametres_entreprise');
    }
};
