<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mvp;
use Illuminate\Http\Request;

class MvpApiController extends Controller
{
    /**
     * Metodo: GET
     * Ruta: /api/mvp
     * Descripcion: Carga todos los MVP que esten creados
     */
    public function index()
    {
        $mvps = Mvp::with(['partido', 'jugador'])->get();
        return response()->json($mvps, 200);
    }

    /**
     * Metodo: POST
     * Ruta: /api/mvp
     * Descripcion: Crea y guarda un nuevo MVP
     */
    public function store(Request $request)
    {
        $request->validate([
            'partido_id' => 'required|exists:partidos,id|unique:mvp,partido_id',    //que haya un unico MVP por partido
            'jugador_id' => 'required|exists:jugadores,id'
        ]);
        $mvp = Mvp::create($request->all());
        return response()->json([
            'message' => 'MVP creado correctamente',
            'data' => $mvp
        ], 201);
    }

    /**
     * Metodo: GET
     * Ruta: /api/mvp/{id}
     * Descripcion: Muestra un MVP por su id
     */
    public function show(string $id)
    {
        $mvp = Mvp::with(['partido', 'jugador'])->find($id);
        if(!$mvp){
            return response()->json(['message' => 'MVP no encontrado'], 404);
        }
        return response()->json($mvp, 200);
    }

    /**
     * Metodo: PUT
     * Ruta: /api/mvp/{id}
     * Descripcion: Actualiza un MVP
     */
    public function update(Request $request, string $id)
    {
        $mvp = Mvp::find($id);
        if(!$mvp){
            return response()->json(['message' => 'MVP no encontrado'], 404);
        }
        $request->validate([
            'partido_id' => 'required|exists:partidos,id|unique:mvp,partido_id',    //que haya un unico MVP por partido
            'jugador_id' => 'required|exists:jugadores,id'
        ]);
        $mvp->update($request->all());
        return response()->json([
            'message' => 'MVP actualizado correctamente',
            'data' => $mvp
        ], 200);
    }

    /**
     * Metodo: DELETE
     * Ruta: /api/mvp/{id}
     * Descripcion: Elimina un MVP
     */
    public function destroy(string $id)
    {
        $mvp = Mvp::find($id);
        if(!$mvp){
            return response()->json(['message' => 'MVP no encontrado'], 404);
        }
        $mvp->delete();
        return response()->json(['message' => 'MVP eliminado correctamente'], 200);
    }
}
