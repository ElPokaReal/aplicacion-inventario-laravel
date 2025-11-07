import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DebtFormModal from './DebtFormModal';
import ConfirmDialog from './ConfirmDialog';
import DataTable from './DataTable';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const { user } = useAuth();
  const isAdmin = user && user.roles && user.roles.some(role => role.name === 'admin');

  const [showModal, setShowModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState(null);

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

  const handleDeleteClick = useCallback((id) => {
    setDebtToDelete(id);
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!debtToDelete) return;
    
    try {
      await api.delete(`/debts/${debtToDelete}`);
      fetchDebts();
      toast.success('Deuda eliminada con éxito!');
    } catch (err) {
      toast.error('Error al eliminar la deuda.');
      console.error(err);
    } finally {
      setShowConfirmDialog(false);
      setDebtToDelete(null);
    }
  }, [debtToDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowConfirmDialog(false);
    setDebtToDelete(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'user.name',
        header: 'Empleado',
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.user ? row.original.user.name : 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'monto',
        header: 'Monto',
        cell: ({ row }) => (
          <span className="font-bold text-red-600 dark:text-red-400">
            ${row.original.monto}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400 max-w-xs truncate block">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: 'pagada',
        header: 'Pagada',
        cell: ({ row }) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              row.original.pagada
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {row.original.pagada ? 'Sí' : 'No'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) =>
          isAdmin ? (
            <div className="flex space-x-2">
              <button
                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded transition-colors duration-200"
                onClick={() => handleShowModal(row.original)}
              >
                <Edit size={16} />
              </button>
              <button
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
                onClick={() => handleDeleteClick(row.original.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : null,
      },
    ],
    [isAdmin, handleDeleteClick]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Deudas</h1>
        {isAdmin && (
          <button 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
            onClick={() => handleShowModal()}
          >
            <PlusCircle className="mr-2" size={18} /> Agregar Nueva Deuda
          </button>
        )}
      </div>

      <DataTable 
        data={debts} 
        columns={columns} 
        searchPlaceholder="Buscar deudas por empleado, descripción..."
      />

      <DebtFormModal
        show={showModal}
        handleClose={handleCloseModal}
        debt={selectedDebt}
        onSave={handleSaveDebt}
      />

      <ConfirmDialog
        show={showConfirmDialog}
        title="Eliminar Deuda"
        message="¿Estás seguro de que deseas eliminar esta deuda? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Debts;