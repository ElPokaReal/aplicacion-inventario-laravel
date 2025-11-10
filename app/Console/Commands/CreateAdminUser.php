<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-admin
                            {--name= : El nombre del administrador}
                            {--email= : El correo electrónico del administrador}
                            {--password= : La contraseña del administrador}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea un usuario administrador en el sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Crear Usuario Administrador ===');
        $this->newLine();

        // Valores por defecto
        $name = $this->option('name') ?? 'Anthony Rojas';
        $email = $this->option('email') ?? 'anthonyrojas2584@hotmail.com';
        $password = $this->option('password') ?? 'Angelcrack2584';

        // Validar email
        $validator = Validator::make(['email' => $email], [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            $this->error('El correo electrónico no es válido.');
            return 1;
        }

        // Verificar si el usuario ya existe
        if (User::where('email', $email)->exists()) {
            $this->error('Ya existe un usuario con este correo electrónico.');
            $this->info('Si deseas usar otro email, usa: php artisan user:create-admin --email="otro@email.com"');
            return 1;
        }

        // Validar contraseña
        if (strlen($password) < 4) {
            $this->error('La contraseña debe tener al menos 4 caracteres.');
            return 1;
        }

        // Verificar que existe el rol de admin
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->error('No se encontró el rol "admin" en la base de datos.');
            $this->info('Por favor, ejecuta las migraciones y seeders primero.');
            return 1;
        }

        // Crear el usuario
        try {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            // Asignar rol de administrador
            $user->roles()->attach($adminRole->id);

            $this->newLine();
            $this->info('✓ Usuario administrador creado exitosamente!');
            $this->newLine();
            $this->table(
                ['Campo', 'Valor'],
                [
                    ['ID', $user->id],
                    ['Nombre', $user->name],
                    ['Email', $user->email],
                    ['Rol', 'Administrador'],
                ]
            );

            return 0;
        } catch (\Exception $e) {
            $this->error('Error al crear el usuario: ' . $e->getMessage());
            return 1;
        }
    }
}
