<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    protected $table = 'imagenes_producto';
    protected $fillable = ['producto_id', 'ruta'];

    public function producto()
    {
        return $this->belongsTo(Product::class, 'producto_id');
    }
}
