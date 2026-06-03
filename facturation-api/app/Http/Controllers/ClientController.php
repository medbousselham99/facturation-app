<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::query()
            ->when(request('search'), fn($q, $s) => $q->where('nom', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->when(request('sort'), fn($q, $s) => $q->orderBy(ltrim($s, '-'), str_starts_with($s, '-') ? 'desc' : 'asc'), fn($q) => $q->latest())
            ->paginate(request('per_page', 10));

        return response()->json($clients);
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        $client->loadCount(['devis', 'commandes', 'factures']);

        return response()->json($client);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json(null, 204);
    }
}
