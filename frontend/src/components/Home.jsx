import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Package, ShoppingCart, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  const { companySettings } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <img 
            src={companySettings.logo} 
            alt={companySettings.name}
            className="h-24 w-24 object-contain mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {companySettings.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Sistema de Gestión de Inventario
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            RIF: {companySettings.rif}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-200">
            <Package className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={40} />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gestión de Productos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Control completo de tu inventario</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-200">
            <ShoppingCart className="mx-auto mb-3 text-green-600 dark:text-green-400" size={40} />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ventas en Tiempo Real</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registra y monitorea tus ventas</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-200">
            <TrendingUp className="mx-auto mb-3 text-purple-600 dark:text-purple-400" size={40} />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reportes Detallados</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Análisis y estadísticas completas</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-200">
            <Shield className="mx-auto mb-3 text-red-600 dark:text-red-400" size={40} />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Seguro y Confiable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Protección de tus datos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Comienza Ahora
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Inicia sesión para acceder al sistema de inventario
          </p>
          <div className="space-y-4">
            <Link 
              to="/login" 
              className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-center"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
