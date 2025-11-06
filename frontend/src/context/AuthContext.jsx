import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // No intentar obtener el usuario si estamos en páginas de autenticación
      // Con HashRouter, la ruta está en window.location.hash
      const currentHash = window.location.hash.replace('#', '') || '/';
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      
      if (authPaths.some(path => currentHash.startsWith(path))) {
        setLoading(false);
        return;
      }

      // Verificar si hay un token guardado
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/user');
        const userData = response.data;
        
        // Asegurarse de que los roles están cargados
        console.log('Usuario cargado:', userData);
        console.log('Roles del usuario:', userData.roles);
        
        setUser(userData);
      } catch (err) {
        console.error('Error al obtener usuario:', err);
        setUser(null);
        // Si falla, limpiar el token inválido
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Función helper para verificar si es admin
  const isAdmin = () => {
    return user && user.roles && user.roles.some(role => role.name === 'admin');
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout failed', err);
      // Limpiar el token incluso si falla la petición
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

