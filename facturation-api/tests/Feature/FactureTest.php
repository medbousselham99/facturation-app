<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Facture;
use App\Models\DocumentSequence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactureTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();

        DocumentSequence::create([
            'document_type' => 'facture',
            'prefixe' => 'FAC-',
            'annee_courante' => date('Y'),
            'prochain_numero' => 1,
        ]);
    }

    public function test_list_factures()
    {
        Facture::factory()->for(Client::factory())->count(3)->create();

        $response = $this->actingAs($this->user)->getJson('/api/factures');

        $response->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_create_facture()
    {
        $client = Client::factory()->create();

        $response = $this->actingAs($this->user)->postJson('/api/factures', [
            'client_id' => $client->id,
            'date_facture' => now()->format('Y-m-d'),
            'date_echeance' => now()->addDays(30)->format('Y-m-d'),
            'montant_ht' => 100,
            'montant_tva' => 20,
            'montant_ttc' => 120,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('montant_ht', '100.00');
    }

    public function test_show_facture()
    {
        $facture = Facture::factory()->for(Client::factory())->create();

        $response = $this->actingAs($this->user)->getJson("/api/factures/{$facture->id}");

        $response->assertOk()->assertJsonPath('id', $facture->id);
    }

    public function test_delete_facture()
    {
        $facture = Facture::factory()->for(Client::factory())->create();

        $response = $this->actingAs($this->user)->deleteJson("/api/factures/{$facture->id}");

        $response->assertStatus(204);
    }
}
