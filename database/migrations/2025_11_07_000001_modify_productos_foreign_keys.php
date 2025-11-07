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
        Schema::table('productos', function (Blueprint $table) {
            // Eliminar las restricciones de clave foránea existentes
            $table->dropForeign(['categoria_id']);
            $table->dropForeign(['proveedor_id']);
            
            // Hacer las columnas nullable
            $table->foreignId('categoria_id')->nullable()->change();
            $table->foreignId('proveedor_id')->nullable()->change();
            
            // Recrear las restricciones con SET NULL en lugar de CASCADE
            $table->foreign('categoria_id')
                  ->references('id')
                  ->on('categorias')
                  ->onDelete('set null');
                  
            $table->foreign('proveedor_id')
                  ->references('id')
                  ->on('proveedores')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // Eliminar las restricciones modificadas
            $table->dropForeign(['categoria_id']);
            $table->dropForeign(['proveedor_id']);
            
            // Volver a hacer las columnas no nullable
            $table->foreignId('categoria_id')->nullable(false)->change();
            $table->foreignId('proveedor_id')->nullable(false)->change();
            
            // Recrear las restricciones originales con CASCADE
            $table->foreign('categoria_id')
                  ->references('id')
                  ->on('categorias')
                  ->onDelete('cascade');
                  
            $table->foreign('proveedor_id')
                  ->references('id')
                  ->on('proveedores')
                  ->onDelete('cascade');
        });
    }
};
