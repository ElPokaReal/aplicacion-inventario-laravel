import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { Home, LayoutDashboard, Package, Truck, ShoppingCart, Wallet, LogIn, UserPlus, LogOut, Menu, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { getTotalItems } = useCart();
  const { theme, toggleTheme, companySettings } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="bg-gray-900 dark:bg-gray-950 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src={companySettings.logo} 
              alt={companySettings.name}
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
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
            <button
              onClick={toggleTheme}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
              title={theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
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
              <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" to="/login">
                <LogIn size={18} className="mr-1" /> Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
