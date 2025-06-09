<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipo;
use Illuminate\Http\Request;

class EquipoApiController extends Controller
{
    /**
     * Metodo: GET
     * Ruta: /api/equipos
     * Descripcion: Carga todos los equipos que esten creados
     */
    public function index()
    {
        $equipos = Equipo::with(['jugadores'])->get();
        return response()->json($equipos, 200);
    }

    /**
     * Metodo: POST
     * Ruta: /api/equipos
     * Descripcion: Crea y guarda un nuevo equipo
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
        ]);
        //if para que si el usuario pone el nombre de un equipo y el equipo ya existe te devuelva el id de ese equipo para que no se repita el mismo equipo varias veces
        $equipoExistente = Equipo::where('nombre', $request->nombre)->first();  //first() para obtener el primer resultado de la consulta
        if ($equipoExistente) {
            return response()->json([
                'message' => 'El equipo ya existe',
                'data' => $equipoExistente
            ], 200);
        }
        //si el equipo que el usuario no existia pues se crea un nuevo equipo
        $equipo = Equipo::create($request->all());
        return response()->json([
            'message' => 'Equipo creado correctamente',
            'data' => $equipo
        ], 201);
    }

    /**
     * Metodo: GET
     * Ruta: /api/equipos/{id}
     * Descripcion: Muestra un equipo por su id
     */
    public function show(string $id)
    {
        $equipo = Equipo::with(['jugadores'])->find($id);
        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }
        return response()->json($equipo, 200);
    }

    /**
     * Metodo: PUT
     * Ruta: /api/equipos/{id}
     * Descripcion: Actualiza un equipo
     */
    public function update(Request $request, string $id)
    {
        $equipo = Equipo::find($id);
        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }
        $request->validate([
            'nombre' => 'required|string',
        ]);
        $equipo->update($request->all());
        return response()->json([
            'message' => 'Equipo actualizado correctamente',
            'data' => $equipo
        ], 200);
    }

    /**
     * Metodo: DELETE
     * Ruta: /api/equipos/{id}
     * Descripcion: Elimina un equipo
     */
    public function destroy(string $id)
    {
        $equipo = Equipo::find($id);
        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }
        $equipo->delete();
        return response()->json(['message' => 'Equipo eliminado correctamente'], 200);
    }
}
