<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mvp extends Model
{
    use HasFactory;

    protected $fillable = ['partido_id', 'jugador_id'];
    protected $table = 'mvp';
    //desactiva el created_at y updated_at
    public $timestamps = false;

    public function partido(){
        return $this->belongsTo(Partido::class);
    }

    public function jugador(){
        return $this->belongsTo(Jugador::class);
    }
}
