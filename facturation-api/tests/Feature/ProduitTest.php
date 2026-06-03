<?php

namespace Tests\Feature;

use App\Models\Produit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProduitTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_list_produits()
    {
        Produit::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->getJson('/api/produits');

        $response->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_create_produit()
    {
        $response = $this->actingAs($this->user)->postJson('/api/produits', [
            'nom' => 'Produit Test',
            'prix_unitaire_ht' => 100,
        ]);

        $response->assertStatus(201)
            ->assertJson(['nom' => 'Produit Test']);
    }

    public function test_update_produit()
    {
        $produit = Produit::factory()->create();

        $response = $this->actingAs($this->user)->putJson("/api/produits/{$produit->id}", [
            'prix_unitaire_ht' => 200,
        ]);

        $response->assertOk();
        $this->assertEquals(200, $produit->fresh()->prix_unitaire_ht);
    }

    public function test_delete_produit()
    {
        $produit = Produit::factory()->create();

        $response = $this->actingAs($this->user)->deleteJson("/api/produits/{$produit->id}");

        $response->assertStatus(204);
    }
}
