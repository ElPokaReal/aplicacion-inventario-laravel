<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'productos';
    protected $fillable = ['name', 'description', 'price', 'existencias', 'categoria_id', 'user_id', 'proveedor_id'];

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'proveedor_id');
    }

    public function category()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'producto_id');
    }
}
