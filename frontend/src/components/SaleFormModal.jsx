import React, { useState, useEffect } from 'react';
import { PlusCircle, ShoppingCart, Trash2, CheckCircle, X } from 'lucide-react';
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
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Registrar Nueva Venta</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Productos Disponibles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Disponibles</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            ${product.price} • Existencias: {product.existencias}
                          </p>
                        </div>
                        <button
                          className="ml-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.existencias === 0}
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carrito de Compras */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Carrito de Compras</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart size={48} className="mx-auto mb-2 text-gray-300" />
                        <p>El carrito está vacío.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.product_id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">${item.price} c/u</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                max={item.existencias}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                              <button
                                type="button"
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                onClick={() => handleRemoveFromCart(item.product_id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={cart.length === 0}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Completar Venta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaleFormModal;