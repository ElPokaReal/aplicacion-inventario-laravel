import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario está cargado y es admin, redirigir a su dashboard
    if (user && !loading) {
      console.log('ProtectedRoute - Usuario:', user);
      console.log('ProtectedRoute - Es Admin:', isAdmin());
      console.log('ProtectedRoute - Ruta actual:', location.pathname);
      console.log('ProtectedRoute - adminOnly:', adminOnly);

      // Si es admin y está en rutas de usuario, redirigir a admin
      if (isAdmin() && !adminOnly && (location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/shop')) {
        console.log('Redirigiendo admin a /admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
      }
      
      // Si no es admin y está intentando acceder a rutas de admin, redirigir a shop
      if (!isAdmin() && adminOnly) {
        console.log('Redirigiendo empleado a /shop');
        navigate('/shop', { replace: true });
      }
    }
  }, [user, loading, isAdmin, location.pathname, adminOnly, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
