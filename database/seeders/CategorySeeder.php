<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['nombre' => 'Electrodomésticos'],
            ['nombre' => 'Tecnología'],
            ['nombre' => 'Hogar y Jardín'],
            ['nombre' => 'Ropa y Accesorios'],
            ['nombre' => 'Deportes'],
            ['nombre' => 'Libros y Papelería'],
            ['nombre' => 'Juguetes y Juegos'],
            ['nombre' => 'Salud y Belleza'],
            ['nombre' => 'Automotriz'],
            ['nombre' => 'Otros'],
        ];

        foreach ($categories as $category) {
            Categoria::create($category);
        }
    }
} 