import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const isAdmin = user.roles && user.roles.some(role => role.name === 'admin');
      
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default DashboardRedirect;
