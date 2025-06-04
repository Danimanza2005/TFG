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
        Schema::create('partidos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['liga', 'amistoso']);
            $table->foreignId('liga_id')->nullable()->constrained('ligas')->onDelete('set null');
            $table->foreignId('equipo_a_id')->constrained('equipos')->onDelete('cascade');
            $table->foreignId('equipo_b_id')->constrained('equipos')->onDelete('cascade');
            $table->string('resultado');
            $table->timestamp('fecha')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidos');
    }
};
