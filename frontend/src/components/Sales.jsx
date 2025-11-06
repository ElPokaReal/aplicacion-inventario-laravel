import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import SaleFormModal from './SaleFormModal';
import DataTable from './DataTable';
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
  };

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
        accessorKey: 'total_venta',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-bold text-green-600 dark:text-green-400">
            ${row.original.total_venta}
          </span>
        ),
      },
      {
        id: 'products',
        header: 'Productos',
        enableSorting: false,
        cell: ({ row }) => (
          <ul className="space-y-1 text-sm">
            {row.original.products.map((product) => (
              <li key={product.id} className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{product.name}</span>
                <span className="text-gray-400 dark:text-gray-500">
                  ({product.pivot.quantity} @ ${product.pivot.price})
                </span>
              </li>
            ))}
          </ul>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ventas</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
          onClick={handleShowModal}
        >
          <PlusCircle className="mr-2" size={18} /> Registrar Nueva Venta
        </button>
      </div>

      <DataTable 
        data={sales} 
        columns={columns} 
        searchPlaceholder="Buscar ventas por empleado, productos..."
      />

      <SaleFormModal
        show={showModal}
        handleClose={handleCloseModal}
        onSave={handleSaveSale}
      />
    </div>
  );
};

export default Sales;