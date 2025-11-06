import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('DashboardRedirect - Usuario:', user);
      console.log('DashboardRedirect - Roles:', user.roles);
      console.log('DashboardRedirect - Es Admin:', isAdmin());
      
      if (isAdmin()) {
        console.log('Redirigiendo a /admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('Redirigiendo a /shop');
        navigate('/shop', { replace: true });
      }
    }
  }, [user, navigate, isAdmin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default DashboardRedirect;
