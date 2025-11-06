<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Actualizar el nombre del rol 'user' a 'empleado'
        DB::table('roles')
            ->where('name', 'user')
            ->update(['name' => 'empleado']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir el cambio
        DB::table('roles')
            ->where('name', 'empleado')
            ->update(['name' => 'user']);
    }
};
