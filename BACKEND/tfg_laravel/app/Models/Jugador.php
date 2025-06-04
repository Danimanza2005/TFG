<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    use HasFactory;

    protected $fillable =['nombre', 'equipo_id'];

    public function equipo(){
        return $this->belongsTo(Equipo::class);
    }

    public function acciones(){
        return $this->hasMany(Accion::class);
    }

    public function mvp(){
        return $this->hasOne(Mvp::class);
    }
}
