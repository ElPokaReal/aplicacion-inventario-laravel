<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Categoria;
use App\Models\ImagenProducto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $products = Product::with('category', 'user', 'provider', 'imagenes')->get();
        
        // Ensure category_id is properly set for each product
        $products->each(function ($product) {
            if ($product->category) {
                $product->category_id = $product->category->id;
            }
        });
        
        return response($products, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'existencias' => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id',
            'proveedor_id' => 'required|exists:proveedores,id',
            'imagenes.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'existencias' => $request->existencias,
            'categoria_id' => $request->categoria_id,
            'user_id' => Auth::id(),
            'proveedor_id' => $request->proveedor_id,
        ]);

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $image) {
                $path = $image->store('products', 'public');
                $product->imagenes()->create(['ruta' => $path]);
            }
        }

        return response($product->load('imagenes'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $product = Product::with('category', 'user', 'provider', 'imagenes')->findOrFail($id);
        return response($product, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): Response
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'existencias' => 'sometimes|required|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id',
            'proveedor_id' => 'nullable|exists:proveedores,id',
            'imagenes.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::findOrFail($id);
        $product->update($request->except('imagenes'));

        if ($request->hasFile('imagenes')) {
            // Eliminar imágenes antiguas
            foreach ($product->imagenes as $imagen) {
                Storage::disk('public')->delete($imagen->ruta);
                $imagen->delete();
            }
            // Guardar nuevas imágenes
            foreach ($request->file('imagenes') as $image) {
                $path = $image->store('products', 'public');
                $product->imagenes()->create(['ruta' => $path]);
            }
        }

        return response($product->load('imagenes'), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        $product = Product::findOrFail($id);
        foreach ($product->imagenes as $imagen) {
            Storage::disk('public')->delete($imagen->ruta);
        }
        $product->delete();
        return response(null, 204);
    }
}
