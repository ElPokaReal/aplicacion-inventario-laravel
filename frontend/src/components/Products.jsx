import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductFormModal from './ProductFormModal';
import { Button } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      toast.error('Error al obtener productos.');
      console.error(err);
    }
  };

  const handleShowModal = (product = null) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    fetchProducts();
    handleCloseModal();
    // Toast for save/edit will be handled in ProductFormModal
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      toast.success('Producto eliminado con éxito!');
    } catch (err) {
      toast.error('Error al eliminar el producto.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Productos</h2>

      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        <PlusCircle className="me-2" size={18} /> Agregar Nuevo Producto
      </Button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Existencias</th>
            <th>Imagen</th>
            <th>Categoría</th>
            <th>Agregado Por</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.existencias}</td>
              <td>
                {product.imagenes && product.imagenes.length > 0 && (
                  <img src={`http://localhost:8000/storage/${product.imagenes[0].ruta}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                )}
              </td>
              <td>{product.category ? product.category.nombre : 'N/A'}</td>
              <td>{product.user ? product.user.name : 'N/A'}</td>
              <td>{product.provider ? product.provider.name : 'N/A'}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowModal(product)}><Edit size={16} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductFormModal
        show={showModal}
        handleClose={handleCloseModal}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Products;