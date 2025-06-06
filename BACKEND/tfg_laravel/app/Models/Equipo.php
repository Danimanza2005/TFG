<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;

    protected $fillable =['nombre'];
    //desactiva el created_at y updated_at
    public $timestamps = false;

    public function jugadores(){
        return $this->hasMany(Jugador::class);
    }

    public function acciones(){
        return $this->hasMany(Accion::class);
    }

    public function partidosLocal(){
        return $this->hasMany(Partido::class, 'equipo_a_id');
    }

    public function partidosVisitante(){
        return $this->hasMany(Partido::class, 'equipo_b_id');
    }
}
