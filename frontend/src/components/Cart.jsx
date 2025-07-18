import React from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const productsToSell = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      await api.post('/sales', { products: productsToSell });
      clearCart();
      toast.success('Compra realizada con éxito!');
      navigate('/shop'); // Redirect to shop after successful purchase
    } catch (error) {
      console.error('Error al completar la compra:', error);
      toast.error('Hubo un error al procesar su compra. Inténtelo de nuevo.');
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Carrito vaciado correctamente!');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tu Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">Tu carrito está vacío.</div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3 d-flex align-items-center justify-content-center p-2">
                    {item.imagenes && item.imagenes.length > 0 && (
                      <img src={`http://localhost:8000/storage/${item.imagenes[0].ruta}`} className="img-fluid rounded-start" alt={item.name} style={{ maxHeight: '120px', objectFit: 'contain' }} />
                    )}
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text text-muted">{item.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0">Precio Unitario: <strong>${item.price}</strong></p>
                          <p className="mb-0">Subtotal: <strong>${(item.price * item.quantity).toFixed(2)}</strong></p>
                        </div>
                        <div className="d-flex align-items-center">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1}><Minus size={16} /></button>
                          <span className="mx-2">{item.quantity}</span>
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQuantity(item.id)} disabled={item.quantity >= item.existencias}><Plus size={16} /></button>
                          <button className="btn btn-danger btn-sm ms-3" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title">Resumen de la Compra</h4>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <h5>Total de Artículos:</h5>
                  <h5>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</h5>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <h3>Total a Pagar:</h3>
                  <h3>${getTotalPrice().toFixed(2)}</h3>
                </div>
                <button className="btn btn-success w-100" onClick={handleCheckout}>Completar Compra</button>
                <button className="btn btn-outline-danger w-100 mt-2" onClick={handleClearCart}>Vaciar Carrito</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;