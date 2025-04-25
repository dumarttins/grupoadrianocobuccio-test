<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Wallet
    Route::prefix('wallet')->group(function () {
        Route::get('/balance', [WalletController::class, 'getBalance']);
        Route::post('/deposit', [WalletController::class, 'deposit']);
        Route::post('/transfer', [WalletController::class, 'transfer']);
        Route::get('/transactions', [WalletController::class, 'transactions']);
        Route::post('/transactions/{transactionId}/reverse', [WalletController::class, 'reverseTransaction']);
    });
});