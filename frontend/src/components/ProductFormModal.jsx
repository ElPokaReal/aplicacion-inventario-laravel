import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, X, DollarSign, Package, Tag, Truck, FileText, Image, ClipboardList } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProductFormModal = ({ show, handleClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    existencias: '',
    categoria_id: '',
    proveedor_id: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        existencias: product.existencias || '',
        categoria_id: product.categoria_id || '',
        proveedor_id: product.proveedor_id || '',
      });
      setExistingImages(product.imagenes || []);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        existencias: '',
        categoria_id: '',
        proveedor_id: '',
      });
      setExistingImages([]);
    }
    setSelectedFiles([]); // Clear selected files on product change
  }, [product]);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagenes') {
      setSelectedFiles(Array.from(files));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    selectedFiles.forEach((file) => {
      data.append('imagenes[]', file);
    });

    try {
      if (product) {
        data.append('_method', 'PUT'); // Laravel expects _method for PUT requests with FormData
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
      toast.error('Error al guardar el producto. Verifique los datos.');
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nombre del producto"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
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
                      type="number"
                      step="0.01"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
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
                      type="number"
                      id="existencias"
                      name="existencias"
                      value={formData.existencias}
                      onChange={handleChange}
                      required
                      placeholder="Cantidad en stock"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
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
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      name="proveedor_id"
                      value={formData.proveedor_id}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Selecciona un proveedor</option>
                      {providers.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
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
                      onChange={handleChange}
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
