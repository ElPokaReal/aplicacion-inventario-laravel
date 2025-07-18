<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response(Categoria::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias',
        ]);

        $category = Categoria::create($request->all());

        return response($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $category = Categoria::findOrFail($id);
        return response($category, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): Response
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255|unique:categorias,nombre,' . $id,
        ]);

        $category = Categoria::findOrFail($id);
        $category->update($request->all());

        return response($category, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        Categoria::destroy($id);
        return response(null, 204);
    }
}
