<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\Api\AccionApiController;
use App\Http\Controllers\Api\EquipoApiController;
use App\Http\Controllers\Api\JugadorApiController;
use App\Http\Controllers\Api\LigaApiController;
use App\Http\Controllers\Api\MvpApiController;
use App\Http\Controllers\Api\PartidoApiController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//registro
Route::post('/register', [AuthController::class, 'register']);

//login
Route::post('/login', [AuthController::class, 'login']);

//Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    //logout
    Route::post('/logout', [AuthController::class, 'logout']);

    //usuario autenticado
    Route::get('/user', function(Request $request) {
        return $request->user();
    });

    //rutas API para acciones
    Route::get('/acciones', [AccionApiController::class, 'index']);
    Route::post('/acciones', [AccionApiController::class, 'store']);
    Route::get('/acciones/{id}', [AccionApiController::class, 'show']);
    Route::put('/acciones/{id}', [AccionApiController::class, 'update']);
    Route::delete('/acciones/{id}', [AccionApiController::class, 'destroy']);

    //rutas API para equipos
    Route::get('/equipos', [EquipoApiController::class, 'index']);
    Route::post('/equipos', [EquipoApiController::class, 'store']);
    Route::get('/equipos/{id}', [EquipoApiController::class, 'show']);
    Route::put('/equipos/{id}', [EquipoApiController::class, 'update']);
    Route::delete('/equipos/{id}', [EquipoApiController::class, 'destroy']);

    //rutas API para jugadores
    Route::get('/jugadores', [JugadorApiController::class, 'index']);
    Route::post('/jugadores', [JugadorApiController::class, 'store']);
    Route::get('/jugadores/{id}', [JugadorApiController::class, 'show']);
    Route::put('/jugadores/{id}', [JugadorApiController::class, 'update']);
    Route::delete('/jugadores/{id}', [JugadorApiController::class, 'destroy']);

    //rutas API para ligas
    Route::get('/ligas', [LigaApiController::class, 'index']);
    Route::post('/ligas', [LigaApiController::class, 'store']);
    Route::get('/ligas/{id}', [LigaApiController::class, 'show']);
    Route::put('/ligas/{id}', [LigaApiController::class, 'update']);
    Route::delete('/ligas/{id}', [LigaApiController::class, 'destroy']);

    //rutas API para MVPs
    Route::get('/mvp', [MvpApiController::class, 'index']);
    Route::post('/mvp', [MvpApiController::class, 'store']);
    Route::get('/mvp/{id}', [MvpApiController::class, 'show']);
    Route::put('/mvp/{id}', [MvpApiController::class, 'update']);
    Route::delete('/mvp/{id}', [MvpApiController::class, 'destroy']);

    //ruta ultimos partidos
    Route::get('/partidos/ultimos-partidos', [PartidoApiController::class, 'ultimosPartidos']);
    //rutas API para partidos
    Route::get('/partidos', [PartidoApiController::class, 'index']);
    Route::post('/partidos', [PartidoApiController::class, 'store']);
    Route::get('/partidos/{id}', [PartidoApiController::class, 'show']);
    Route::put('/partidos/{id}', [PartidoApiController::class, 'update']);
    Route::delete('/partidos/{id}', [PartidoApiController::class, 'destroy']);
});
