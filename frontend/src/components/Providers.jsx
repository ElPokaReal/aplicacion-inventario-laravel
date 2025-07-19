import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProviderFormModal from './ProviderFormModal';
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
    try {
      await api.delete(`/providers/${id}`);
      fetchProviders();
      toast.success('Proveedor eliminado con éxito!');
    } catch (err) {
      toast.error('Error al eliminar el proveedor.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
          onClick={() => handleShowModal()}
        >
          <PlusCircle className="mr-2" size={18} /> Agregar Nuevo Proveedor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{provider.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors duration-200" 
                        onClick={() => handleShowModal(provider)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200" 
                        onClick={() => handleDelete(provider.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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