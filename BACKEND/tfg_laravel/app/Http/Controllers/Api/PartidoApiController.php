<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partido;
use Illuminate\Http\Request;

class PartidoApiController extends Controller
{
    /**
     * Metodo: GET
     * Ruta: /api/partidos
     * Descripcion: Carga todos los partidos que esten creados
     */
    public function index()
    {
        $partidos = Partido::with(['equipoA', 'equipoB', 'acciones.jugador', 'mvp.jugador'])->get();
        return response()->json($partidos, 200);
    }

    /**
     * Metodo: POST
     * Ruta: /api/partidos
     * Descripcion: Crea y guarda un nuevo partido
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:liga,amistoso',
            'liga_id' => 'nullable|exists:ligas,id',
            'equipo_a_id' => 'required|exists:equipos,id',
            'equipo_b_id' => 'required|exists:equipos,id',
            'resultado' => 'required|string',
            'fecha' => 'required|date'
        ]);
        $partido = Partido::create($request->all());
        return response()->json([
            'message' => 'Partido creado correctamente',
            'data' => $partido
        ], 201);
    }

    /**
     * Metodo: GET
     * Ruta: /api/partidos/{id}
     * Descripcion: Muestra un partido por su id
     */
    public function show(string $id)
    {
        $partido = Partido::with(['equipoA', 'equipoB', 'acciones.jugador', 'mvp.jugador'])->find($id);
        if(!$partido){
            return response()->json(['message' => 'Partido no encontrado'], 404);
        }
        return response()->json($partido, 200);
    }

    /**
     * Metodo: PUT
     * Ruta: /api/partidos/{id}
     * Descripcion: Actualiza un partido
     */
    public function update(Request $request, string $id)
    {
        $partido = Partido::find($id);
        if(!$partido){
            return response()->json(['message' => 'Partido no encontrado'], 404);
        }
        $request->validate([
            'tipo' => 'required|in:liga,amistoso',
            'liga_id' => 'nullable|exists:ligas,id',
            'equipo_a_id' => 'required|exists:equipos,id',
            'equipo_b_id' => 'required|exists:equipos,id',
            'resultado' => 'required|string',
            'fecha' => 'required|date'
        ]);
        $partido->update($request->all());
        return response()->json([
            'message' => 'Partido actualizado correctamente',
            'data' => $partido
        ], 200);
    }

    /**
     * Metodo: DELETE
     * Ruta: /api/partidos/{id}
     * Descripcion: Elimina un partido
     */
    public function destroy(string $id)
    {
        $partido = Partido::find($id);
        if(!$partido){
            return response()->json(['message' => 'Partido no encontrado'], 404);
        }
        $partido->delete();
        return response()->json(['message' => 'Partido eliminado correctamente'], 200);
    }
}
