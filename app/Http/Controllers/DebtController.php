<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Debt;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class DebtController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        if (Auth::user()->roles()->where('name', 'admin')->exists()) {
            return response(Debt::with('user')->get(), 200);
        } else {
            return response(Auth::user()->debts()->with('user')->get(), 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'monto' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $debt = Debt::create(['user_id' => $request->user_id, 'monto' => $request->monto, 'description' => $request->description]);

        return response($debt, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $debt = Debt::with('user')->findOrFail($id);
        if (Auth::user()->roles()->where('name', 'admin')->exists() || Auth::id() == $debt->user_id) {
            return response($debt, 200);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): Response
    {
        $request->validate([
            'monto' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'pagada' => 'sometimes|required|boolean',
        ]);

        $debt = Debt::findOrFail($id);
        if (Auth::user()->roles()->where('name', 'admin')->exists() || Auth::id() == $debt->user_id) {
            $debt->update(['monto' => $request->monto, 'description' => $request->description, 'pagada' => $request->pagada]);
            return response($debt, 200);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        $debt = Debt::findOrFail($id);
        if (Auth::user()->roles()->where('name', 'admin')->exists() || Auth::id() == $debt->user_id) {
            $debt->delete();
            return response(null, 204);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
