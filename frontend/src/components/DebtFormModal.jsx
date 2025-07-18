import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Save, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const DebtFormModal = ({ show, handleClose, debt, onSave }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    monto: '',
    description: '',
    pagada: false,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (debt) {
      setFormData({
        user_id: debt.user_id || '',
        monto: debt.monto || '',
        description: debt.description || '',
        pagada: debt.pagada || false,
      });
    } else {
      setFormData({
        user_id: '',
        monto: '',
        description: '',
        pagada: false,
      });
    }
  }, [debt]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      toast.error('Error al cargar usuarios.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (debt) {
        await api.put(`/debts/${debt.id}`, formData);
        toast.success('Deuda actualizada con éxito!');
      } else {
        await api.post('/debts', formData);
        toast.success('Deuda agregada con éxito!');
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error('Error al guardar la deuda:', err);
      toast.error('Error al guardar la deuda. Verifique los datos.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{debt ? 'Editar Deuda' : 'Agregar Nueva Deuda'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Select name="user_id" value={formData.user_id} onChange={handleChange} required>
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control type="number" step="0.01" name="monto" value={formData.monto} onChange={handleChange} required placeholder="0.00" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción de la deuda" />
          </Form.Group>
          <Form.Group className="mb-3 form-check">
            <Form.Check type="checkbox" label="Pagada" name="pagada" checked={formData.pagada} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            {debt ? <><Save size={18} className="me-2" /> Actualizar</> : <><PlusCircle size={18} className="me-2" /> Agregar</>}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DebtFormModal;