import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import DebtFormModal from './DebtFormModal';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Deudas</h1>
        {isAdmin && (
          <button 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
            onClick={() => handleShowModal()}
          >
            <PlusCircle className="mr-2" size={18} /> Agregar Nueva Deuda
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {debts.map((debt) => (
                <tr key={debt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{debt.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{debt.user ? debt.user.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">${debt.monto}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{debt.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      debt.pagada 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {debt.pagada ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button 
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors duration-200" 
                          onClick={() => handleShowModal(debt)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200" 
                          onClick={() => handleDelete(debt.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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