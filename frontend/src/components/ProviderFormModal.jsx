import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, PlusCircle, X, User, Phone, Mail, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Schema de validación con Zod
const providerSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s+\-()]+$/.test(val), {
      message: 'El teléfono solo puede contener números, espacios y los caracteres + - ( )'
    }),
  email: z.string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Ingresa un correo electrónico válido'
    }),
});

const ProviderFormModal = ({ show, handleClose, provider, onSave }) => {
  const { register, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    }
  });

  useEffect(() => {
    if (show) {
      // Resetear inmediatamente cuando se abre el modal
      if (provider) {
        reset({
          name: provider.name || '',
          phone: provider.phone || '',
          email: provider.email || '',
        });
      } else {
        reset({
          name: '',
          phone: '',
          email: '',
        });
      }
    } else {
      // Limpiar cuando se cierra para evitar flash de datos antiguos
      reset();
    }
  }, [provider, show, reset]);

  const onSubmit = async (formData) => {
    try {
      if (provider) {
        await api.put(`/providers/${provider.id}`, formData);
        toast.success('Proveedor actualizado con éxito!');
      } else {
        await api.post('/providers', formData);
        toast.success('Proveedor agregado con éxito!');
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error('Error al guardar el proveedor:', err);
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach(key => {
          toast.error(err.response.data.errors[key][0]);
        });
      } else {
        toast.error('Error al guardar el proveedor. Verifique los datos.');
      }
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <User size={24} className="mr-2" />
                {provider ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    placeholder="Nombre del proveedor"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
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

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    {...register('phone')}
                    placeholder="Ej: +1234567890"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="email"
                    {...register('email')}
                    placeholder="correo@ejemplo.com"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
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

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                >
                  <X size={18} className="mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  {provider ? (
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
      )}
    </>
  );
};

export default ProviderFormModal;
