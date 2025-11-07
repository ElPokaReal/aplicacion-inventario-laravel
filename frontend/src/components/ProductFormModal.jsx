import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, PlusCircle, X, DollarSign, Package, Tag, Truck, FileText, Image, ClipboardList, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Schema de validación con Zod
const productSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  description: z.string().optional(),
  price: z.string()
    .min(1, 'El precio es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'El precio debe ser un número mayor a 0'
    }),
  existencias: z.string()
    .min(1, 'Las existencias son requeridas')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0 && Number.isInteger(parseFloat(val)), {
      message: 'Las existencias deben ser un número entero mayor o igual a 0'
    }),
  categoria_id: z.string().min(1, 'Selecciona una categoría'),
  proveedor_id: z.string().min(1, 'Selecciona un proveedor'),
});

const ProductFormModal = ({ show, handleClose, product, onSave }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);

  const { register, handleSubmit: handleFormSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      existencias: '',
      categoria_id: '',
      proveedor_id: '',
    }
  });

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  useEffect(() => {
    if (show) {
      // Resetear inmediatamente cuando se abre el modal
      if (product) {
        reset({
          name: product.name || '',
          description: product.description || '',
          price: String(product.price || ''),
          existencias: String(product.existencias || ''),
          categoria_id: String(product.categoria_id || ''),
          proveedor_id: String(product.proveedor_id || ''),
        });
        setExistingImages(product.imagenes || []);
      } else {
        reset({
          name: '',
          description: '',
          price: '',
          existencias: '',
          categoria_id: '',
          proveedor_id: '',
        });
        setExistingImages([]);
      }
      setSelectedFiles([]);
    } else {
      // Limpiar cuando se cierra para evitar flash de datos antiguos
      reset();
      setExistingImages([]);
      setSelectedFiles([]);
    }
  }, [product, show, reset]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Error al obtener categorías.');
      console.error('Error al obtener categorías:', err);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await api.get('/providers');
      setProviders(response.data);
    } catch (err) {
      toast.error('Error al obtener proveedores.');
      console.error('Error al obtener proveedores:', err);
    }
  };

  const handleFileChange = useCallback((e) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  }, []);

  const onSubmit = async (formData) => {
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    selectedFiles.forEach((file) => {
      data.append('imagenes[]', file);
    });

    try {
      if (product) {
        data.append('_method', 'PUT');
        await api.post(`/products/${product.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Producto actualizado con éxito!');
      } else {
        await api.post('/products', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Producto agregado con éxito!');
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach(key => {
          toast.error(err.response.data.errors[key][0]);
        });
      } else {
        toast.error('Error al guardar el producto. Verifique los datos.');
      }
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Package size={28} className="mr-2" />
                {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClipboardList className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      placeholder="Nombre del producto"
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

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="price"
                      {...register('price')}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="existencias" className="block text-sm font-medium text-gray-700 mb-2">
                    Existencias
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="existencias"
                      {...register('existencias')}
                      placeholder="Cantidad en stock"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.existencias ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.existencias && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.existencias.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="categoria_id"
                      {...register('categoria_id')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.categoria_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.categoria_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.categoria_id.message}
                    </p>
                  )}
                </div>

                {/* Provider */}
                <div className="md:col-span-2">
                  <label htmlFor="proveedor_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Truck className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="proveedor_id"
                      {...register('proveedor_id')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.proveedor_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un proveedor</option>
                      {providers.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.proveedor_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.proveedor_id.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descripción del producto"
                      rows="3"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="md:col-span-2">
                  <label htmlFor="imagenes" className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="file"
                      id="imagenes"
                      name="imagenes"
                      multiple
                      onChange={handleFileChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  {existingImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales:</p>
                      <div className="flex space-x-2">
                        {existingImages.map((img) => (
                          <img
                            key={img.id}
                            src={`http://localhost:8000/storage/${img.ruta}`}
                            alt="Producto"
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                  {product ? (
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

export default ProductFormModal;
