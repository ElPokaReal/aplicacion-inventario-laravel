<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleUser extends Model
{
    protected $table = 'rol_usuario';
    protected $fillable = ['user_id', 'role_id'];
}
