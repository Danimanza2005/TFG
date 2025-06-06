<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Liga extends Model
{
    use HasFactory;

    protected $fillable =['nombre'];
    //desactiva el created_at y updated_at
    public $timestamps = false;

    public function partidos(){
        return $this->hasMany(Partido::class);
    }
}
