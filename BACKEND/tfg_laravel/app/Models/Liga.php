<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Liga extends Model
{
    use HasFactory;

    protected $fillable =['nombre'];

    public function partidos(){
        return $this->hasMany(Partido::class);
    }
}
