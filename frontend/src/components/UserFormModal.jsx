import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, PlusCircle, X, User, Mail, Key, Shield, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Schema de validación con Zod
const userSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  email: z.string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  password: z.string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'La contraseña debe tener al menos 8 caracteres'
    }),
  password_confirmation: z.string().optional(),
  role: z.enum(['admin', 'empleado'], {
    errorMap: () => ({ message: 'Selecciona un rol válido' })
  }),
}).refine((data) => {
  // Si hay password, debe haber confirmación y deben coincidir
  if (data.password && data.password.length > 0) {
    return data.password === data.password_confirmation;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

const UserFormModal = ({ show, handleClose, user, onSave }) => {
  const { register, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'empleado',
    }
  });

  useEffect(() => {
    if (show) {
      if (user) {
        const userRole = user.roles && user.roles.length > 0 
          ? (user.roles.some(r => r.name === 'admin') ? 'admin' : 'empleado')
          : 'empleado';
        
        reset({
          name: user.name || '',
          email: user.email || '',
          password: '',
          password_confirmation: '',
          role: userRole,
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: 'empleado',
        });
      }
    } else {
      reset();
    }
  }, [user, show, reset]);

  const onSubmit = async (formData) => {
    try {
      // Preparar datos para enviar
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // Solo incluir password si se proporcionó
      if (formData.password && formData.password.length > 0) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }

      if (user) {
        await api.put(`/users/${user.id}`, dataToSend);
        toast.success('Usuario actualizado con éxito!');
      } else {
        // Al crear, la contraseña es obligatoria
        if (!formData.password || formData.password.length === 0) {
          toast.error('La contraseña es requerida para crear un usuario');
          return;
        }
        await api.post('/users', dataToSend);
        toast.success('Usuario creado con éxito!');
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error('Error al guardar el usuario:', err);
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach(key => {
          toast.error(err.response.data.errors[key][0]);
        });
      } else {
        toast.error('Error al guardar el usuario. Verifique los datos.');
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <User size={24} className="mr-2" />
            {user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                {...register('name')}
                placeholder="Nombre del usuario"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                {...register('email')}
                placeholder="correo@ejemplo.com"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña {user && <span className="text-xs text-gray-500">(dejar en blanco para no cambiar)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                {...register('password')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password_confirmation"
                {...register('password_confirmation')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="role"
                {...register('role')}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
            >
              <X size={18} className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200 flex items-center"
            >
              {user ? (
                <>
                  <Save size={18} className="mr-2" /> Actualizar
                </>
              ) : (
                <>
                  <PlusCircle size={18} className="mr-2" /> Agregar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
