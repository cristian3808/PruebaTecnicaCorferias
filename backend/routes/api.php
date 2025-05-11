<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventoController;

//Obtener todos los eventos
Route::get('/eventos', [EventoController::class, 'index']);
//Crear un nuevo evento
Route::post('/eventos',[EventoController::class, 'store']);
//Actualizar un evento
Route::put('/eventos/{id}', [EventoController::class, 'update']);
//Eliminar un evento
Route::delete('/eventos/{id}',[EventoController::class,'destroy']);
//Simular la venta de boletos
Route::post('/eventos/{id}/vender', [EventoController::class, 'vender']);
