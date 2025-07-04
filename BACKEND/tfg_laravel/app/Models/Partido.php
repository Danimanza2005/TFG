<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partido extends Model
{
    use HasFactory;

    protected $fillable =['tipo', 'liga_id', 'equipo_a_id', 'equipo_b_id', 'resultado', 'fecha'];
    protected $table = 'partidos';
    //desactiva el created_at y updated_at
    public $timestamps = false;

    //para cambiar formato de fecha
    protected $casts =['fecha' => 'datetime'];

    public function liga(){
        return $this->belongsTo(Liga::class);
    }

    public function equipoA(){
        return $this->belongsTo(Equipo::class, 'equipo_a_id');
    }

    public function equipoB(){
        return $this->belongsTo(Equipo::class, 'equipo_b_id');
    }

    //tabla intermedia
    public function jugadores(){
        return $this->belongsToMany(Jugador::class, 'jugador_partido', 'partido_id', 'jugador_id');
    }

    public function acciones(){
        return $this->hasMany(Accion::class);
    }

    public function mvp(){
        return $this->hasOne(Mvp::class);
    }
}
