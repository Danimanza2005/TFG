<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partido extends Model
{
    use HasFactory;

    protected $fillable =['tipo', 'liga_id', 'equipo_a_id', 'equipo_b_id', 'resultado', 'fecha'];
    //desactiva el created_at y updated_at
    public $timestamps = false;

    public function liga(){
        return $this->belongsTo(Liga::class);
    }

    public function equipoA(){
        return $this->belongsTo(Equipo::class, 'equipo_a_id');
    }

    public function equipoB(){
        return $this->belongsTo(Equipo::class, 'equipo_b_id');
    }

    public function acciones(){
        return $this->hasMany(Accion::class);
    }

    public function mvp(){
        return $this->hasOne(Mvp::class);
    }
}
