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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Tu Carrito de Compras</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-8 py-10 rounded-xl text-center max-w-lg mx-auto">
          <p className="text-2xl font-bold mb-3">Tu carrito está vacío.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
          >
            Ir a la Tienda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center space-x-6 transition-colors duration-200">
                <div className="flex-shrink-0">
                  {item.imagenes && item.imagenes.length > 0 ? (
                    <img 
                      src={`http://localhost:8000/storage/${item.imagenes[0].ruta}`} 
                      className="w-28 h-28 rounded-lg object-cover"
                      alt={item.name} 
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">Precio: ${item.price}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                        onClick={() => decreaseQuantity(item.id)} 
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                        onClick={() => increaseQuantity(item.id)} 
                        disabled={item.quantity >= item.existencias}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-28 transition-colors duration-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Envío</span>
                  <span className="font-semibold">Gratis</span>
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <button 
                  className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </button>
                <button 
                  className="w-full mt-2 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
                  onClick={handleClearCart}
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;