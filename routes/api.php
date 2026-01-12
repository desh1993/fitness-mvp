<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'user' => $request->user(),
        'timestamp' => now()->toDateTimeString(),
    ]);
})->middleware('auth:sanctum');
