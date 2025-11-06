import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/reports/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">¡Bienvenido, {user?.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total de Productos</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{statistics?.total_products || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{statistics?.total_stock || 0} unidades en stock</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Ventas Totales</h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{statistics?.total_sales || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">${statistics?.total_sales_amount?.toLocaleString() || 0} en ventas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Deudas Pendientes</h3>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">{statistics?.total_debts || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">${statistics?.total_debt_amount?.toLocaleString() || 0} por cobrar</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Categorías</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{statistics?.total_categories || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{statistics?.total_providers || 0} proveedores</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Resumen General</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={[
            { 
              name: 'Resumen', 
              Productos: statistics?.total_products || 0,
              Ventas: statistics?.total_sales || 0,
              Deudas: statistics?.total_debts || 0,
              Categorías: statistics?.total_categories || 0
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Productos" fill="#6366f1" name="Productos" />
            <Bar dataKey="Ventas" fill="#10b981" name="Ventas" />
            <Bar dataKey="Deudas" fill="#ef4444" name="Deudas" />
            <Bar dataKey="Categorías" fill="#3b82f6" name="Categorías" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
