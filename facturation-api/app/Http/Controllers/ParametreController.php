<?php

namespace App\Http\Controllers;

use App\Models\ParametreEntreprise;
use Illuminate\Http\Request;

class ParametreController extends Controller
{
    public function index()
    {
        $parametres = ParametreEntreprise::first();

        if (!$parametres) {
            $parametres = ParametreEntreprise::create([
                'nom_entreprise' => 'Mon Entreprise',
                'devise' => 'MAD',
                'tva_defaut' => 20.00,
            ]);
        }

        return response()->json($parametres);
    }

    public function update(Request $request)
    {
        $parametres = ParametreEntreprise::first();

        if (!$parametres) {
            return response()->json(['message' => 'Aucun paramètre trouvé'], 404);
        }

        $validated = $request->validate([
            'nom_entreprise' => 'sometimes|required|string|max:255',
            'adresse' => 'nullable|string|max:500',
            'ville' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:20',
            'pays' => 'nullable|string|max:255',
            'siret' => 'nullable|string|max:14',
            'numero_tva' => 'nullable|string|max:50',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|string|max:500',
            'devise' => 'nullable|string|max:10',
            'tva_defaut' => 'nullable|numeric|min:0|max:100',
        ]);

        $parametres->update($validated);

        return response()->json($parametres);
    }
}
