import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DebtFormModal from './DebtFormModal';
import { Button } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const { user } = useAuth();
  const isAdmin = user && user.roles && user.roles.some(role => role.name === 'admin');

  const [showModal, setShowModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  useEffect(() => {
    fetchDebts();
  }, [isAdmin]);

  const fetchDebts = async () => {
    try {
      const response = await api.get('/debts');
      setDebts(response.data);
    } catch (err) {
      toast.error('Error al obtener deudas.');
      console.error(err);
    }
  };

  const handleShowModal = (debt = null) => {
    setSelectedDebt(debt);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDebt(null);
  };

  const handleSaveDebt = () => {
    fetchDebts();
    handleCloseModal();
    // Toast for save/edit will be handled in DebtFormModal
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/debts/${id}`);
      fetchDebts();
      toast.success('Deuda eliminada con éxito!');
    } catch (err) {
      toast.error('Error al eliminar la deuda.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Deudas</h2>

      {isAdmin && (
        <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
          <PlusCircle className="me-2" size={18} /> Agregar Nueva Deuda
        </Button>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Monto</th>
            <th>Descripción</th>
            <th>Pagada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <tr key={debt.id}>
              <td>{debt.id}</td>
              <td>{debt.user ? debt.user.name : 'N/A'}</td>
              <td>${debt.monto}</td>
              <td>{debt.description}</td>
              <td>{debt.pagada ? 'Sí' : 'No'}</td>
              <td>
                {isAdmin && (
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowModal(debt)}><Edit size={16} /></button>
                )}
                {isAdmin && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(debt.id)}><Trash2 size={16} /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DebtFormModal
        show={showModal}
        handleClose={handleCloseModal}
        debt={selectedDebt}
        onSave={handleSaveDebt}
      />
    </div>
  );
};

export default Debts;