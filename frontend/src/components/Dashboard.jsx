import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', ventas: 4000, deudas: 2400 },
  { name: 'Feb', ventas: 3000, deudas: 1398 },
  { name: 'Mar', ventas: 2000, deudas: 9800 },
  { name: 'Abr', ventas: 2780, deudas: 3908 },
  { name: 'May', ventas: 1890, deudas: 4800 },
  { name: 'Jun', ventas: 2390, deudas: 3800 },
  { name: 'Jul', ventas: 3490, deudas: 4300 },
];

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido, {user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">Aquí tienes un resumen de la actividad de tu tienda.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Productos</h3>
          <p className="text-4xl font-bold text-gray-900">150</p>
          <p className="text-gray-500 text-sm">Actualmente en stock</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ventas Totales (Hoy)</h3>
          <p className="text-4xl font-bold text-green-600">$1,200.00</p>
          <p className="text-gray-500 text-sm">Ingresos generados hoy</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Deudas Pendientes</h3>
          <p className="text-4xl font-bold text-red-600">$500.00</p>
          <p className="text-gray-500 text-sm">Total de deudas por cobrar</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Ventas y Deudas</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#3b82f6" name="Ventas" />
            <Bar dataKey="deudas" fill="#ef4444" name="Deudas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
