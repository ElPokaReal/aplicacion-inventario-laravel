import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Download, FileText, BarChart3, TrendingUp, DollarSign, Package, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/reports/statistics');
      setStatistics(response.data);
    } catch (err) {
      toast.error('Error al obtener estadísticas.');
      console.error(err);
    }
  };

  const downloadReport = async (reportType) => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/${reportType}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Reporte de ${getReportName(reportType)} descargado exitosamente!`);
    } catch (err) {
      toast.error(`Error al descargar el reporte de ${getReportName(reportType)}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getReportName = (type) => {
    const names = {
      'general': 'General',
      'products': 'Productos',
      'debts': 'Deudas',
      'sales': 'Ventas'
    };
    return names[type] || type;
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color: color }} />
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ title, description, icon: Icon, type, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color: color }} />
        </div>
        <button
          onClick={() => downloadReport(type)}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          <span>{loading ? 'Descargando...' : 'Descargar'}</span>
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes</h1>
        <p className="text-gray-600">Genera y descarga reportes detallados en formato Excel</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Productos"
            value={statistics.total_products}
            icon={Package}
            color="#3B82F6"
            subtitle={`${statistics.total_stock} en stock`}
          />
          <StatCard
            title="Total Ventas"
            value={statistics.total_sales}
            icon={TrendingUp}
            color="#8B5CF6"
            subtitle={`$${statistics.total_sales_amount?.toLocaleString() || 0}`}
          />
          <StatCard
            title="Deudas Pendientes"
            value={statistics.total_debts}
            icon={AlertTriangle}
            color="#F59E0B"
            subtitle={`$${statistics.total_debt_amount?.toLocaleString() || 0}`}
          />
          <StatCard
            title="Total Categorías"
            value={statistics.total_categories}
            icon={BarChart3}
            color="#10B981"
            subtitle={`${statistics.total_providers} proveedores`}
          />
        </div>
      )}

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          title="Reporte General"
          description="Reporte completo con todas las estadísticas del sistema, incluyendo productos, deudas, ventas y categorías en múltiples hojas."
          icon={BarChart3}
          type="general"
          color="#3B82F6"
        />
        
        <ReportCard
          title="Reporte de Productos"
          description="Lista detallada de todos los productos con información de stock, precios, categorías y estado de inventario."
          icon={Package}
          type="products"
          color="#10B981"
        />
        
        <ReportCard
          title="Reporte de Deudas"
          description="Información completa de todas las deudas, montos pendientes, fechas de vencimiento y estado de cobranza."
          icon={AlertTriangle}
          type="debts"
          color="#F59E0B"
        />
        
        <ReportCard
          title="Reporte de Ventas"
          description="Historial detallado de todas las ventas realizadas, productos vendidos y métodos de pago utilizados."
          icon={TrendingUp}
          type="sales"
          color="#8B5CF6"
        />
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FileText className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Información sobre los Reportes</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Los reportes se generan en tiempo real con los datos más actualizados</li>
              <li>• Todos los archivos se descargan en formato Excel (.xlsx)</li>
              <li>• El reporte general incluye múltiples hojas con diferentes tipos de información</li>
              <li>• Los archivos incluyen formato y estilos para mejor legibilidad</li>
              <li>• Los nombres de archivo incluyen la fecha de generación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 