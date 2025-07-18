import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../assets/Shop.css'; // Import the new CSS file
import { useCart } from '../context/CartContext'; // Import useCart
import toast from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const { addToCart } = useCart(); // Use the addToCart function from CartContext

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products-for-shop');
      setProducts(response.data);
    } catch (err) {
      setError('Error al obtener productos.');
      console.error(err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} añadido al carrito!`);
  };

  return (
    <div className="container shop-container">
      <h2 className="shop-title">Nuestros Productos</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="product-card">
              <div className="product-image-container">
                {product.imagenes && product.imagenes.length > 0 && (
                  <img src={`http://localhost:8000/storage/${product.imagenes[0].ruta}`} className="product-image" alt={product.name} />
                )}
              </div>
              <div className="card-body product-card-body">
                <h5 className="product-name">{product.name}</h5>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-stock">Existencias: {product.existencias}</p>
                <button
                  className="btn add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.existencias === 0}
                >
                  {product.existencias === 0 ? 'Agotado' : 'Añadir al Carrito'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;