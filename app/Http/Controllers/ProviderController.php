<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Provider;
use Illuminate\Http\Response;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response(Provider::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:proveedores',
        ]);

        $provider = Provider::create($request->all());

        return response($provider, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $provider = Provider::findOrFail($id);
        return response($provider, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): Response
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:proveedores,email,' . $id,
        ]);

        $provider = Provider::findOrFail($id);
        $provider->update($request->all());

        return response($provider, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        Provider::destroy($id);
        return response(null, 204);
    }
}
