<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response(Sale::with('products', 'user')->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:productos,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $total = 0;
            $sale = Sale::create([
                'user_id' => Auth::id(),
                'total_venta' => 0, // Will be updated later
            ]);

            foreach ($request->products as $item) {
                $product = Product::find($item['product_id']);

                if ($product->existencias < $item['quantity']) {
                    DB::rollBack();
                    return response()->json(['message' => 'Not enough stock for product ' . $product->name], 400);
                }

                $sale->products()->attach($product->id, [
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $product->existencias -= $item['quantity'];
                $product->save();

                $total += ($product->price * $item['quantity']);
            }

            $sale->total_venta = $total;
            $sale->save();

            DB::commit();
            return response($sale->load('products', 'user'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating sale: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $sale = Sale::with('products', 'user')->findOrFail($id);
        return response($sale, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): Response
    {
        $request->validate([
            'total_venta' => 'sometimes|required|numeric|min:0',
        ]);

        $sale = Sale::findOrFail($id);
        $sale->update($request->all());

        return response($sale->load('products', 'user'), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        $sale = Sale::findOrFail($id);
        
        DB::beginTransaction();
        try {
            // Restore product stock
            foreach ($sale->products as $product) {
                $originalQuantity = $product->pivot->quantity;
                $p = Product::find($product->id);
                $p->existencias += $originalQuantity;
                $p->save();
            }
            $sale->delete();
            DB::commit();
            return response(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error deleting sale: ' . $e->getMessage()], 500);
        }
    }
}
