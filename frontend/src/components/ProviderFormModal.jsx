import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Save, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProviderFormModal = ({ show, handleClose, provider, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name || '',
        phone: provider.phone || '',
        email: provider.email || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
      });
    }
  }, [provider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error('Error al guardar el proveedor. Verifique los datos.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{provider ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nombre del proveedor" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: +1234567890" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
          </Form.Group>
          <Button variant="primary" type="submit">
            {provider ? <><Save size={18} className="me-2" /> Actualizar</> : <><PlusCircle size={18} className="me-2" /> Agregar</>}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProviderFormModal;