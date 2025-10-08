<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Sanctum CSRF cookie route - usar la ruta oficial de Sanctum
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])
    ->middleware(['web']);

require __DIR__.'/auth.php';
