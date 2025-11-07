
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Package, Truck, ShoppingCart, Wallet, LogOut, Settings, FileText, Moon, Sun, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, companySettings } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-full w-64 bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-200">
      <div className="flex flex-col items-center justify-center py-4 border-b border-gray-800 dark:border-gray-700">
        <img 
          src={companySettings.logo} 
          alt={companySettings.name}
          className="h-20 w-20 object-contain mb-2"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <nav className="flex-grow mt-5">
        <Link
          to="/admin/dashboard"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/dashboard') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard size={20} className="mr-3" />
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/products') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <Package size={20} className="mr-3" />
          Productos
        </Link>
        <Link
          to="/admin/providers"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/providers') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <Truck size={20} className="mr-3" />
          Proveedores
        </Link>
        <Link
          to="/admin/sales"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/sales') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <ShoppingCart size={20} className="mr-3" />
          Ventas
        </Link>
        <Link
          to="/admin/debts"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/debts') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <Wallet size={20} className="mr-3" />
          Deudas
        </Link>
        <Link
          to="/admin/users"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/users') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <Users size={20} className="mr-3" />
          Usuarios
        </Link>
        <Link
          to="/admin/categories"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/categories') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <Settings size={20} className="mr-3" />
          Categorías
        </Link>
        <Link
          to="/admin/reports"
          className={`flex items-center px-6 py-3 text-base transition-colors duration-200 ${
            isActive('/admin/reports') ? 'bg-gray-800 dark:bg-gray-900' : 'hover:bg-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <FileText size={20} className="mr-3" />
          Reportes
        </Link>
      </nav>
      <div className="border-t border-gray-800 dark:border-gray-700 p-4">
        <button
          onClick={toggleTheme}
          className="w-full mb-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {theme === 'light' ? (
            <>
              <Moon size={16} className="mr-2" />
              Modo Oscuro
            </>
          ) : (
            <>
              <Sun size={16} className="mr-2" />
              Modo Claro
            </>
          )}
        </button>
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
            alt="Avatar"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          <LogOut size={16} className="mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
