import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProviderFormModal from './ProviderFormModal';
import { Button } from 'react-bootstrap';
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
    <div className="container mt-4">
      <h2>Proveedores</h2>

      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        <PlusCircle className="me-2" size={18} /> Agregar Nuevo Proveedor
      </Button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.id}</td>
              <td>{provider.name}</td>
              <td>{provider.phone}</td>
              <td>{provider.email}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowModal(provider)}><Edit size={16} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(provider.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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