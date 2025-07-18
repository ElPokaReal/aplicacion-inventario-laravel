import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import SaleFormModal from './SaleFormModal';
import { Button } from 'react-bootstrap';
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
    <div className="container mt-4">
      <h2>Ventas</h2>

      <Button variant="primary" className="mb-3" onClick={handleShowModal}>
        <PlusCircle className="me-2" size={18} /> Registrar Nueva Venta
      </Button>

      <h3 className="mt-5">Ventas Anteriores</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Productos</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.user ? sale.user.name : 'N/A'}</td>
              <td>${sale.total_venta}</td>
              <td>
                <ul className="list-unstyled">
                  {sale.products.map((product) => (
                    <li key={product.id}>
                      {product.name} ({product.pivot.quantity} @ ${product.pivot.price})
                    </li>
                  ))}
                </ul>
              </td>
              <td>{new Date(sale.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SaleFormModal
        show={showModal}
        handleClose={handleCloseModal}
        onSave={handleSaveSale}
      />
    </div>
  );
};

export default Sales;