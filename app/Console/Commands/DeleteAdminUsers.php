<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class DeleteAdminUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:delete-admins 
                            {--force : Eliminar sin confirmación}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Elimina todos los usuarios con rol de administrador';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->warn('=== Eliminar Usuarios Administradores ===');
        $this->newLine();

        // Buscar el rol de admin
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->error('No se encontró el rol "admin" en la base de datos.');
            return 1;
        }

        // Obtener todos los usuarios con rol admin
        $adminUsers = User::whereHas('roles', function ($query) use ($adminRole) {
            $query->where('roles.id', $adminRole->id);
        })->get();

        if ($adminUsers->isEmpty()) {
            $this->info('No hay usuarios con rol de administrador para eliminar.');
            return 0;
        }

        // Mostrar usuarios a eliminar
        $this->info('Se encontraron ' . $adminUsers->count() . ' usuario(s) administrador(es):');
        $this->newLine();
        
        $this->table(
            ['ID', 'Nombre', 'Email', 'Fecha de Creación'],
            $adminUsers->map(function ($user) {
                return [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->created_at->format('Y-m-d H:i:s'),
                ];
            })->toArray()
        );

        $this->newLine();

        // Confirmar eliminación si no se usa --force
        if (!$this->option('force')) {
            if (!$this->confirm('¿Estás seguro de que deseas eliminar estos usuarios?', false)) {
                $this->info('Operación cancelada.');
                return 0;
            }
        }

        // Eliminar usuarios
        try {
            $count = 0;
            foreach ($adminUsers as $user) {
                // Primero eliminar las relaciones
                $user->roles()->detach();
                $user->sales()->delete();
                $user->debts()->delete();
                
                // Eliminar el usuario
                $user->delete();
                $count++;
            }

            $this->newLine();
            $this->info("✓ Se eliminaron exitosamente {$count} usuario(s) administrador(es).");
            return 0;
        } catch (\Exception $e) {
            $this->error('Error al eliminar usuarios: ' . $e->getMessage());
            return 1;
        }
    }
}
