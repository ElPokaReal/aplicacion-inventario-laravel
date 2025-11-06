import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ProductFormModal from './ProductFormModal';
import DataTable from './DataTable';
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
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      toast.success('Producto eliminado con éxito!');
    } catch (err) {
      toast.error('Error al eliminar el producto.');
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400 max-w-xs truncate block">{row.original.description}</span>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        cell: ({ row }) => `$${row.original.price}`,
      },
      {
        accessorKey: 'existencias',
        header: 'Existencias',
      },
      {
        accessorKey: 'imagenes',
        header: 'Imagen',
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          return product.imagenes && product.imagenes.length > 0 ? (
            <img
              src={`http://localhost:8000/storage/${product.imagenes[0].ruta}`}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-xs">Sin imagen</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'category.nombre',
        header: 'Categoría',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.original.category ? row.original.category.nombre : 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'user.name',
        header: 'Agregado Por',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.original.user ? row.original.user.name : 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'provider.name',
        header: 'Proveedor',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.original.provider ? row.original.provider.name : 'N/A'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded transition-colors duration-200"
              onClick={() => handleShowModal(row.original)}
            >
              <Edit size={16} />
            </button>
            <button
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleShowModal]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Productos</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
          onClick={() => handleShowModal()}
        >
          <PlusCircle className="mr-2" size={18} /> Agregar Nuevo Producto
        </button>
      </div>

      <DataTable 
        data={products} 
        columns={columns} 
        searchPlaceholder="Buscar productos por nombre, descripción, categoría..."
      />

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