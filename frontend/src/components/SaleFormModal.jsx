import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { PlusCircle, ShoppingCart, Trash2, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SaleFormModal = ({ show, handleClose, onSave }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      toast.error('Error al cargar productos.');
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      // Check if adding one more exceeds stock
      const productInStock = products.find(p => p.id === product.id);
      if (existingItem.quantity + 1 > productInStock.existencias) {
        toast.error(`No hay suficientes existencias para ${product.name}. Solo quedan ${productInStock.existencias} unidades.`);
        return;
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.existencias === 0) {
        toast.error(`El producto ${product.name} está agotado.`);
        return;
      }
      setCart([...cart, { product_id: product.id, quantity: 1, name: product.name, price: product.price, existencias: product.existencias }]);
    }
    toast.success(`${product.name} añadido al carrito de venta!`);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const productInStock = products.find(p => p.id === productId);
    if (parseInt(newQuantity) > productInStock.existencias) {
      toast.error(`No puedes añadir más de ${productInStock.existencias} unidades de ${productInStock.name}.`);
      return;
    }
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: parseInt(newQuantity) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
    toast.success('Producto eliminado del carrito de venta!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (cart.length === 0) {
      toast.error('El carrito está vacío.');
      return;
    }

    try {
      await api.post('/sales', { products: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })) });
      setCart([]);
      onSave();
      handleClose();
      toast.success('Venta registrada con éxito!');
    } catch (err) {
      console.error('Error al crear la venta:', err);
      toast.error('Error al crear la venta. Verifique el stock o los datos.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          <div className="col-md-6">
            <h4>Productos Disponibles</h4>
            <ListGroup className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {products.map((product) => (
                <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">
                  {product.name} - ${product.price} (Existencias: {product.existencias})
                  <Button variant="primary" size="sm" onClick={() => handleAddToCart(product)} disabled={product.existencias === 0}><ShoppingCart size={16} /></Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="col-md-6">
            <h4>Carrito de Compras</h4>
            <Form onSubmit={handleSubmit}>
              <ListGroup className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <ListGroup.Item>El carrito está vacío.</ListGroup.Item>
                ) : (
                  cart.map((item) => (
                    <ListGroup.Item key={item.product_id} className="d-flex justify-content-between align-items-center">
                      {item.name} - ${item.price} x
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                        className="w-25 mx-2"
                      />
                      <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(item.product_id)}><Trash2 size={16} /></Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
              <Button variant="success" type="submit" disabled={cart.length === 0}><CheckCircle size={18} className="me-2" /> Completar Venta</Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SaleFormModal;