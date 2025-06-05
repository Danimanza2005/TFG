<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accion;
use Illuminate\Http\Request;

class AccionApiController extends Controller
{
    /**
     * Metodo: GET
     * Ruta: /api/acciones
     * Descripcion: Carga todas las acciones que esten creadas
     */
    public function index()
    {
        $acciones = Accion::with(['partido', 'jugador', 'equipo'])->get();
        return response()->json($acciones, 200);
    }

    /**
     * Metodo: POST
     * Ruta: /api/acciones
     * Descripcion: Crea y guarda una nueva accion
     */
    public function store(Request $request)
    {
        $request->validate([
            'partido_id' => 'required|exists:partidos,id',
            'jugador_id' => 'required|exists:jugadores,id',
            'equipo_id' => 'required|exists:equipos,id',
            'tipo' => 'required|in:gol,asistencia,amarilla,roja'
        ]);
        $accion = Accion::create($request->all());
        return response()->json([
            'message' => 'Acción creada correctamente',
            'data' => $accion
        ], 201);
    }

    /**
     * Metodo: GET
     * Ruta: /api/acciones/{id}
     * Descripcion: Muestra una accion por su id
     */
    public function show(string $id)
    {
        $accion = Accion::with(['partido', 'jugador', 'equipo'])->find($id);
        if(!$accion){
            return response()->json(['message' => 'Acción no encontrada'], 404);
        }
        return response()->json($accion, 200);
    }

    /**
     * Metodo: PUT
     * Ruta: /api/acciones/{id}
     * Descripcion: Actualiza una accion
     */
    public function update(Request $request, string $id)
    {
        $accion = Accion::find($id);
        if(!$accion){
            return response()->json(['message' => 'Acción no encontrada'], 404);
        }
        $request->validate([
            'partido_id' => 'required|exists:partidos,id',
            'jugador_id' => 'required|exists:jugadores,id',
            'equipo_id' => 'required|exists:equipos,id',
            'tipo' => 'required|in:gol,asistencia,amarilla,roja'
        ]);
        $accion->update($request->all());
        return response()->json([
            'message' => 'Acción actualizada correctamente',
            'data' => $accion
        ], 200);
    }

    /**
     * Metodo: DELETE
     * Ruta: /api/acciones/{id}
     * Descripcion: Elimina una accion
     */
    public function destroy(string $id)
    {
        $accion = Accion::find($id);
        if(!$accion){
            return response()->json(['message' => 'Acción no encontrada'], 404);
        }
        $accion->delete();
        return response()->json(['message' => 'Acción eliminada correctamente'], 200);
    }
}
