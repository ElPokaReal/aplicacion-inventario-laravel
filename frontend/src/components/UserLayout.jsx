
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/shop" className="text-2xl font-bold text-primary-600">
            Comercializadora Mi Ángel
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                <User size={24} />
              </button>
              {/* Invisible bridge to prevent menu from closing */}
              <div className="absolute top-full left-0 right-0 h-2 bg-transparent"></div>
              <div className="absolute right-0 top-full pt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                >
                  <LogOut size={16} className="mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
      <footer className="bg-white mt-12 py-6">
        <div className="container mx-auto text-center text-gray-500">
          &copy; {new Date().getFullYear()} Comercializadora Mi Ángel. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
