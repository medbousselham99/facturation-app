<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\DevisController;
use App\Http\Controllers\LigneDevisController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\LigneCommandeController;
use App\Http\Controllers\BonDeCommandeController;
use App\Http\Controllers\LigneBonDeCommandeController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\LigneFactureController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\AvoirController;
use App\Http\Controllers\ParametreController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\ConversionController;
use App\Http\Controllers\HistoriqueController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Existing resources
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::apiResource('devis', DevisController::class)->parameters(['devis' => 'devis']);
    Route::apiResource('ligne-devis', LigneDevisController::class);
    Route::apiResource('commandes', CommandeController::class);
    Route::post('commandes/{commande}/livrer', [CommandeController::class, 'livrer']);
    Route::apiResource('ligne-commandes', LigneCommandeController::class);
    Route::apiResource('bons-de-commande', BonDeCommandeController::class);
    Route::post('bons-de-commande/{bons_de_commande}/livrer', [BonDeCommandeController::class, 'livrer']);
    Route::apiResource('ligne-bons-de-commande', LigneBonDeCommandeController::class);
    Route::apiResource('factures', FactureController::class);
    Route::apiResource('ligne-factures', LigneFactureController::class);

    // New resources
    Route::apiResource('produits', ProduitController::class);
    Route::apiResource('paiements', PaiementController::class);
    Route::apiResource('avoirs', AvoirController::class);

    // Paramètres (singleton-like)
    Route::get('parametres', [ParametreController::class, 'index']);
    Route::put('parametres', [ParametreController::class, 'update']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Rapports
    Route::get('rapports/ventes', [RapportController::class, 'ventes']);
    Route::get('rapports/tva', [RapportController::class, 'tva']);
    Route::get('rapports/top-clients', [RapportController::class, 'topClients']);

    // Conversions (cycle commercial)
    Route::post('conversion/devis-en-commande/{devis}', [ConversionController::class, 'devisEnCommande']);
    Route::post('conversion/commande-en-facture/{commande}', [ConversionController::class, 'commandeEnFacture']);
    Route::post('conversion/commande-en-bon-commande/{commande}', [ConversionController::class, 'commandeEnBonDeCommande']);
    Route::post('conversion/facture-paiement/{facture}', [ConversionController::class, 'facturePaiement']);
    Route::post('conversion/marquer-payee/{facture}', [ConversionController::class, 'marquerPayee']);

    // Historique
    Route::get('historiques', [HistoriqueController::class, 'index']);
    Route::get('historiques/{documentType}/{documentId}', [HistoriqueController::class, 'forDocument']);

    // PDF & Email
    Route::get('factures/{facture}/pdf', [FactureController::class, 'pdf']);
    Route::post('factures/{facture}/email', [FactureController::class, 'envoyerEmail']);
    Route::post('factures/{facture}/payer', [FactureController::class, 'payer']);
    Route::get('devis/{devis}/pdf', [DevisController::class, 'pdf']);
    Route::post('devis/{devis}/envoyer', [DevisController::class, 'envoyer']);
});
