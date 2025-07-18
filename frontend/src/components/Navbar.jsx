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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">App de Inventario</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && user.roles && user.roles.some(role => role.name === 'admin') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard"><LayoutDashboard size={18} className="me-1" /> Panel de Control</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products"><Package size={18} className="me-1" /> Productos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/providers"><Truck size={18} className="me-1" /> Proveedores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/debts"><Wallet size={18} className="me-1" /> Deudas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories"><Package size={18} className="me-1" /> Categorías</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sales"><ShoppingCart size={18} className="me-1" /> Ventas</Link>
                </li>
              </>
            )}
            {user && !user.roles.some(role => role.name === 'admin') && (
              <li className="nav-item">
                <Link className="nav-link" to="/shop"><ShoppingCart size={18} className="me-1" /> Tienda</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {user && !user.roles.some(role => role.name === 'admin') && (
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  <ShoppingCart size={18} className="me-1" /> Carrito ({getTotalItems()})
                </Link>
              </li>
            )}
            {user ? (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}><LogOut size={18} className="me-1" /> Cerrar Sesión ({user.name})</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login"><LogIn size={18} className="me-1" /> Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register"><UserPlus size={18} className="me-1" /> Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;