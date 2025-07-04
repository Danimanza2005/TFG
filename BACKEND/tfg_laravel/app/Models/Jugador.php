<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    use HasFactory;

    protected $fillable =['nombre', 'equipo_id'];
    protected $table = 'jugadores';
    //desactiva el created_at y updated_at
    public $timestamps = false;

    public function equipo(){
        return $this->belongsTo(Equipo::class);
    }

    //tabla intermedia
    public function partidos(){
        return $this->belongsToMany(Partido::class, 'jugador_partido','jugador_id', 'partido_id');
    }

    public function acciones(){
        return $this->hasMany(Accion::class);
    }

    public function mvp(){
        return $this->hasOne(Mvp::class);
    }
}
