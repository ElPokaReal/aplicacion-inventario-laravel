import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Search, ChevronDown, Filter, X } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Error al obtener categorías.');
      console.error(err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} añadido al carrito!`);
  };

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    setActiveFilters(count);
  }, [searchTerm, selectedCategory, minPrice, maxPrice]);

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Use loose equality for category comparison to handle type conversion
    const selectedCategoryId = selectedCategory === '' ? null : parseInt(selectedCategory);
    const matchesCategory = selectedCategory === '' || product.category_id === selectedCategoryId;
    
    // Define price filters
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Subtle Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Filters */}
      <div className="mb-8">
        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Filter size={18} />
            <span>Filtros</span>
            {activeFilters > 0 && (
              <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilters}
              </span>
            )}
            <ChevronDown size={16} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <div className="relative">
                    <select
                      id="category"
                      className="w-full pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.nombre}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio mínimo</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
                  <input
                    type="number"
                    placeholder="1000.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Nuestros Productos</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {filteredProducts.length === 0 && !error ? (
        <div className="text-center py-16">
          <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-8 py-10 rounded-xl max-w-lg mx-auto">
            <h4 className="text-2xl font-bold mb-3">No hay productos que coincidan con tu búsqueda.</h4>
            <p className="text-blue-600">Intenta ajustar tus filtros.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-2xl">
                {product.imagenes && product.imagenes.length > 0 ? (
                  <img 
                    src={`http://localhost:8000/storage/${product.imagenes[0].ruta}`} 
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" 
                    alt={product.name} 
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
              </div>
              <div className="p-5">
                <h5 className="text-xl font-bold text-gray-800 mb-1 truncate">{product.name}</h5>
                <p className="text-gray-500 text-sm mb-3 line-clamp-1">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-3xl font-black text-primary-600">$ {product.price}</p>
                  <p className="text-sm text-gray-400">Stock: {product.existencias}</p>
                </div>
                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-300 ${product.existencias === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.existencias === 0}
                >
                  {product.existencias === 0 ? 'Agotado' : 'Añadir al Carrito'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
