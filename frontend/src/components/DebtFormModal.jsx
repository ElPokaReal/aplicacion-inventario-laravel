import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, X, User, DollarSign, FileText, CheckCircle } from 'lucide-react';
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
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <DollarSign size={24} className="mr-2" />
                {debt ? 'Editar Deuda' : 'Agregar Nueva Deuda'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Selecciona un usuario</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    id="monto"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
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
                    placeholder="Descripción de la deuda"
                    rows="3"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="pagada"
                      name="pagada"
                      type="checkbox"
                      checked={formData.pagada}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="pagada" className="font-medium text-gray-700 flex items-center">
                      <CheckCircle size={16} className="mr-2 text-gray-400" />
                      Pagada
                    </label>
                  </div>
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
                  {debt ? (
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

export default DebtFormModal;
