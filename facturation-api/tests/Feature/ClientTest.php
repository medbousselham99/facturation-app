<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_list_clients()
    {
        Client::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->getJson('/api/clients');

        $response->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_create_client()
    {
        $response = $this->actingAs($this->user)->postJson('/api/clients', [
            'nom' => 'Client Test',
            'email' => 'client@test.com',
        ]);

        $response->assertStatus(201)
            ->assertJson(['nom' => 'Client Test']);
    }

    public function test_create_client_validation_fails()
    {
        $response = $this->actingAs($this->user)->postJson('/api/clients', []);

        $response->assertStatus(422);
    }

    public function test_show_client()
    {
        $client = Client::factory()->create();

        $response = $this->actingAs($this->user)->getJson("/api/clients/{$client->id}");

        $response->assertOk()->assertJson(['id' => $client->id]);
    }

    public function test_update_client()
    {
        $client = Client::factory()->create();

        $response = $this->actingAs($this->user)->putJson("/api/clients/{$client->id}", [
            'nom' => 'Updated Name',
        ]);

        $response->assertOk()->assertJson(['nom' => 'Updated Name']);
    }

    public function test_delete_client()
    {
        $client = Client::factory()->create();

        $response = $this->actingAs($this->user)->deleteJson("/api/clients/{$client->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('clients', ['id' => $client->id]);
    }

    public function test_unauthenticated_cannot_access_clients()
    {
        $response = $this->getJson('/api/clients');

        $response->assertStatus(401);
    }
}
