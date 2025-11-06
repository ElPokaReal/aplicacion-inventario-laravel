import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import DataTable from './DataTable';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Error al obtener categorías.');
      console.error(err);
    }
  };

  const handleShowModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.nombre : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setCategoryName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, { nombre: categoryName });
        toast.success('Categoría actualizada con éxito!');
      } else {
        await api.post('/categories', { nombre: categoryName });
        toast.success('Categoría agregada con éxito!');
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar la categoría:', err);
      toast.error('Error al guardar la categoría. Verifique los datos.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success('Categoría eliminada con éxito!');
    } catch (err) {
      toast.error('Error al eliminar la categoría.');
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.original.nombre}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded transition-colors duration-200"
              onClick={() => handleShowModal(row.original)}
            >
              <Edit size={16} />
            </button>
            <button
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Categorías</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
          onClick={() => handleShowModal()}
        >
          <PlusCircle className="mr-2" size={18} /> Agregar Nueva Categoría
        </button>
      </div>

      <DataTable 
        data={categories} 
        columns={columns} 
        searchPlaceholder="Buscar categorías..."
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {selectedCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  placeholder="Nombre de la categoría"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  {selectedCategory ? (
                    <>
                      <Save size={16} className="mr-2" /> Actualizar
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} className="mr-2" /> Agregar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;