<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $table = 'proveedores';
    protected $fillable = ['name', 'phone', 'email'];

    public function products()
    {
        return $this->hasMany(Product::class, 'proveedor_id');
    }
}
