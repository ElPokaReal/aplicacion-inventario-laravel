<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user()->load('roles');
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('providers', ProviderController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('users', UserController::class);
    
    // Report routes
    Route::get('/reports/general', [ReportController::class, 'generalReport']);
    Route::get('/reports/products', [ReportController::class, 'productsReport']);
    Route::get('/reports/debts', [ReportController::class, 'debtsReport']);
    Route::get('/reports/sales', [ReportController::class, 'salesReport']);
    Route::get('/reports/statistics', [ReportController::class, 'statistics']);
});

Route::middleware(['auth:sanctum'])->get('/products-for-shop', [ProductController::class, 'index']);
Route::middleware(['auth:sanctum'])->get('/categories', [CategoryController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('sales', SaleController::class);
    Route::apiResource('debts', DebtController::class);
});

require __DIR__.'/auth.php';
