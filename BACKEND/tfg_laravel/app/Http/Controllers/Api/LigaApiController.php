<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Liga;
use Illuminate\Http\Request;

class LigaApiController extends Controller
{
    /**
     * Metodo: GET
     * Ruta: /api/ligas
     * Descripcion: Carga todas las ligas que esten creadas
     */
    public function index()
    {
        $ligas = Liga::with(['partidos'])->get();
        return response()->json($ligas, 200);
    }

    /**
     * Metodo: POST
     * Ruta: /api/ligas
     * Descripcion: Crea y guarda una nueva liga
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string'
        ]);
        $liga = Liga::create($request->all());
        return response()->json([
            'message' => 'Liga creada correctamente',
            'data' => $liga
        ], 201);
    }

    /**
     * Metodo: GET
     * Ruta: /api/ligas/{id}
     * Descripcion: Muestra una liga por su id y sus partidos
     */
    public function show(string $id)
    {
        $liga = Liga::with(['partidos'])->find($id);
        if(!$liga){
            return response()->json(['message' => 'Liga no encontrada'], 404);
        }
        return response()->json($liga, 200);
    }

    /**
     * Metodo: PUT
     * Ruta: /api/ligas/{id}
     * Descripcion: Actualiza una liga
     */
    public function update(Request $request, string $id)
    {
        $liga = Liga::find($id);
        if(!$liga){
            return response()->json(['message' => 'Liga no encontrada'], 404);
        }
        $request->validate([
            'nombre' => 'required|string'
        ]);
        $liga->update($request->all());
        return response()->json([
            'message' => 'Liga actualizada correctamente',
            'data' => $liga
        ], 200);
    }

    /**
     * Metodo: DELETE
     * Ruta: /api/ligas/{id}
     * Descripcion: Elimina una liga
     */
    public function destroy(string $id)
    {
        $liga = Liga::find($id);
        if(!$liga){
            return response()->json(['message' => 'Liga no encontrada'], 404);
        }
        $liga->delete();
        return response()->json(['message' => 'Liga eliminada correctamente'], 200);
    }
}
