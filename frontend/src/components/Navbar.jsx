import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // Import useCart
import { Home, LayoutDashboard, Package, Truck, ShoppingCart, Wallet, LogIn, UserPlus, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { getTotalItems } = useCart(); // Use getTotalItems from CartContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h3 className="text-white text-xl font-bold">App de Inventario</h3>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user && user.roles && user.roles.some(role => role.name === 'admin') && (
              <>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/admin/dashboard">
                  <LayoutDashboard size={18} className="mr-1" /> Panel de Control
                </Link>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/admin/products">
                  <Package size={18} className="mr-1" /> Productos
                </Link>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/admin/providers">
                  <Truck size={18} className="mr-1" /> Proveedores
                </Link>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/admin/debts">
                  <Wallet size={18} className="mr-1" /> Deudas
                </Link>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/admin/categories">
                  <Package size={18} className="mr-1" /> Categorías
                </Link>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/admin/sales">
                  <ShoppingCart size={18} className="mr-1" /> Ventas
                </Link>
              </>
            )}
            {user && !user.roles.some(role => role.name === 'admin') && (
              <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/dashboard/shop">
                <ShoppingCart size={18} className="mr-1" /> Tienda
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && !user.roles.some(role => role.name === 'admin') && (
              <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/dashboard/cart">
                <ShoppingCart size={18} className="mr-1" /> Carrito ({getTotalItems()})
              </Link>
            )}
            {user ? (
              <button 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" 
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-1" /> Cerrar Sesión ({user.name})
              </button>
            ) : (
              <>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/login">
                  <LogIn size={18} className="mr-1" /> Iniciar Sesión
                </Link>
                <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/register">
                  <UserPlus size={18} className="mr-1" /> Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
