<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'ventas';
    protected $fillable = ['user_id', 'total_venta'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'producto_venta', 'venta_id', 'producto_id')->withPivot('quantity', 'price');
    }
}
