<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mvp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partido_id')->unique()->constrained('partidos')->onDelete('cascade');
            $table->foreignId('jugador_id')->constrained('jugadores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mvp');
    }
};
