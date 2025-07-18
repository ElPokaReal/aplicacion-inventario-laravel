<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $table = 'deudas';
    protected $fillable = ['user_id', 'monto', 'description', 'pagada'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
