import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import SaleFormModal from './SaleFormModal';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (err) {
      toast.error('Error al obtener ventas.');
      console.error(err);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveSale = () => {
    fetchSales();
    handleCloseModal();
    // Toast for save will be handled in SaleFormModal
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
          onClick={handleShowModal}
        >
          <PlusCircle className="mr-2" size={18} /> Registrar Nueva Venta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ventas Anteriores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.user ? sale.user.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${sale.total_venta}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="space-y-1">
                      {sale.products.map((product) => (
                        <li key={product.id} className="flex justify-between">
                          <span>{product.name}</span>
                          <span className="text-gray-400">
                            ({product.pivot.quantity} @ ${product.pivot.price})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SaleFormModal
        show={showModal}
        handleClose={handleCloseModal}
        onSave={handleSaveSale}
      />
    </div>
  );
};

export default Sales;