<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jugador;
use Illuminate\Http\Request;

class JugadorApiController extends Controller
{
    /**
     * Metodo: GET
     * Ruta: /api/jugadores
     * Descripcion: Carga todos los jugadores que esten creados
     */
    public function index()
    {
        $jugadores = Jugador::with(['equipo'])->get();
        return response()->json($jugadores, 200);
    }

    /**
     * Metodo: POST
     * Ruta: /api/jugadores
     * Descripcion: Crea y guarda un nuevo jugador
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'equipo_id' => 'required|exists:equipos,id'
        ]);
        $jugador = Jugador::create($request->all());
        return response()->json([
            'message' => 'Jugador creado correctamente',
            'data' => $jugador
        ], 201);
    }

    /**
     * Metodo: GET
     * Ruta: /api/jugadores/{id}
     * Descripcion: Muestra un jugador por su id
     */
    public function show(string $id)
    {
        $jugador = Jugador::with(['equipo'])->find($id);
        if(!$jugador){
            return response()->json(['message' => 'Jugador no encontrado'], 404);
        }
        return response()->json($jugador, 200);
    }

    /**
     * Metodo: PUT
     * Ruta: /api/jugadores/{id}
     * Descripcion: Actualiza un jugador
     */
    public function update(Request $request, string $id)
    {
        $jugador = Jugador::find($id);
        if(!$jugador){
            return response()->json(['message' => 'Jugador no encontrado'], 404);
        }
        $request->validate([
            'nombre' => 'required|string',
            'equipo_id' => 'required|exists:equipos,id'
        ]);
        $jugador->update($request->all());
        return response()->json([
            'message' => 'Jugador actualizado correctamente',
            'data' => $jugador
        ], 200);
    }

    /**
     * Metodo: DELETE
     * Ruta: /api/jugadores/{id}
     * Descripcion: Elimina un jugador
     */
    public function destroy(string $id)
    {
        $jugador = Jugador::find($id);
        if(!$jugador){
            return response()->json(['message' => 'Jugador no encontrado'], 404);
        }
        $jugador->delete();
        return response()->json(['message' => 'Jugador eliminado correctamente'], 200);
    }
}
