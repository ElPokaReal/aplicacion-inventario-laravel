import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ProviderFormModal from './ProviderFormModal';
import DataTable from './DataTable';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await api.get('/providers');
      setProviders(response.data);
    } catch (err) {
      toast.error('Error al obtener proveedores.');
      console.error(err);
    }
  };

  const handleShowModal = (provider = null) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
  };

  const handleSaveProvider = () => {
    fetchProviders();
    handleCloseModal();
    // Toast for save/edit will be handled in ProviderFormModal
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      return;
    }
    try {
      await api.delete(`/providers/${id}`);
      fetchProviders();
      toast.success('Proveedor eliminado con éxito!');
    } catch (err) {
      toast.error('Error al eliminar el proveedor.');
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
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{row.original.phone}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Correo Electrónico',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{row.original.email}</span>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Proveedores</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
          onClick={() => handleShowModal()}
        >
          <PlusCircle className="mr-2" size={18} /> Agregar Nuevo Proveedor
        </button>
      </div>

      <DataTable 
        data={providers} 
        columns={columns} 
        searchPlaceholder="Buscar proveedores por nombre, teléfono, email..."
      />

      <ProviderFormModal
        show={showModal}
        handleClose={handleCloseModal}
        provider={selectedProvider}
        onSave={handleSaveProvider}
      />
    </div>
  );
};

export default Providers;