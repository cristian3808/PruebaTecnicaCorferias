<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    // Obtener todos los eventos
    public function index()
    {
        return response()->json(Evento::all());
    }

    // Crear un nuevo evento
    public function store(Request $request)
    {
        //Validación: No se pueden crear eventos sin nombre, fecha o cantidad de boletos.
        $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_hora' => 'required|date',
            'ubicacion' => 'nullable|string|max:255',
            'boletos_disponibles' => 'required|integer',
            'precio_boleto' => 'nullable|numeric|min:1',
        ]);

        $evento = Evento::create($request->all());
        return response()->json($evento, 201);
    }

    // Vender boletos
    public function vender(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);

        // Verificar si hay boletos disponibles
        if ($evento->boletos_disponibles > 0) {
            $evento->boletos_disponibles -= 1; // Disminuir en 1
            $evento->save();

            return response()->json([
                'message' => 'Venta realizada con éxito',
                'boletos_restantes' => $evento->boletos_disponibles
            ]);
        } else {
            return response()->json([
                'message' => 'No hay boletos disponibles'
            ], 400);
        }
    }

    // Obtener un solo evento
    public function show($id)
    {
        $evento = Evento::findOrFail($id);
        return response()->json($evento);
    }
    // Actualizar un evento
    public function update(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);
        $evento->update($request->all());

        return response()->json($evento);
    }
    // Eliminar un evento
    public function destroy($id)
    {
        $evento = Evento::findOrFail($id);
        $evento->delete();

        return response()->json(['message' => 'Evento eliminado con éxito'], 200);
    }
}
