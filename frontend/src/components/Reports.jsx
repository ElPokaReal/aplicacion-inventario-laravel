import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { Download, FileText, BarChart3, TrendingUp, DollarSign, Package, Users, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { generateExcelReport } from '../utils/excelGenerator';
import { getCompanyLogoBase64 } from '../utils/imageUtils';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyRif: {
    fontSize: 11,
    color: '#6b7280',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  date: {
    fontSize: 11,
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 25,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeader: {
    backgroundColor: '#2563eb',
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    flex: 1,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    fontSize: 8,
    color: '#9ca3af',
  },
});

// Componente PDF
const PDFDocument = ({ title, data, columns, companySettings, logoDataUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
        <View style={styles.headerText}>
          <Text style={styles.companyName}>{companySettings.name}</Text>
          <Text style={styles.companyRif}>RIF: {companySettings.rif}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>
        Fecha de generación: {new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {columns.map((col, index) => (
            <Text key={index} style={styles.tableHeaderCell}>{col}</Text>
          ))}
        </View>

        {/* Data Rows */}
        {data.map((row, rowIndex) => (
          <View 
            key={rowIndex} 
            style={[
              styles.tableRow, 
              rowIndex % 2 === 0 ? styles.tableRowEven : null
            ]}
          >
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={styles.tableCell}>{cell}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>Generado: {new Date().toLocaleString()}</Text>
        <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

const Reports = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const { companySettings } = useTheme();

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

  const downloadReport = async (reportType, format = 'excel') => {
    setLoading(true);
    try {
      if (format === 'pdf') {
        await downloadPDFReport(reportType);
      } else {
        await downloadExcelReport(reportType);
      }
    } catch (err) {
      toast.error(`Error al descargar el reporte de ${getReportName(reportType)}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcelReport = async (reportType) => {
    try {
      // Fetch data based on report type
      let title;
      let columns;
      let rows;

      switch (reportType) {
        case 'products': {
          const productsRes = await api.get('/products');
          const data = productsRes.data;
          title = 'Reporte de Productos';
          columns = ['ID', 'Nombre', 'Precio', 'Existencias', 'Categoría', 'Proveedor'];
          rows = data.map(p => [
            p.id.toString(),
            p.name,
            `$${p.price}`,
            p.existencias.toString(),
            p.category?.nombre || 'N/A',
            p.provider?.name || 'N/A'
          ]);
          break;
        }
        case 'sales': {
          const salesRes = await api.get('/sales');
          const data = salesRes.data;
          title = 'Reporte de Ventas';
          columns = ['ID', 'Empleado', 'Total', 'Fecha'];
          rows = data.map(s => [
            s.id.toString(),
            s.user?.name || 'N/A',
            `$${s.total_venta}`,
            new Date(s.created_at).toLocaleDateString('es-ES')
          ]);
          break;
        }
        case 'debts': {
          const debtsRes = await api.get('/debts');
          const data = debtsRes.data;
          title = 'Reporte de Deudas';
          columns = ['ID', 'Empleado', 'Monto', 'Descripción', 'Pagada'];
          rows = data.map(d => [
            d.id.toString(),
            d.user?.name || 'N/A',
            `$${d.monto}`,
            d.description || '',
            d.pagada ? 'Sí' : 'No'
          ]);
          break;
        }
        case 'general':
          title = 'Reporte General';
          columns = ['Estadística', 'Valor'];
          rows = [
            ['Total Productos', (statistics?.total_products || 0).toString()],
            ['Total Stock', (statistics?.total_stock || 0).toString()],
            ['Total Ventas', (statistics?.total_sales || 0).toString()],
            ['Monto Ventas', `$${statistics?.total_sales_amount || 0}`],
            ['Deudas Pendientes', (statistics?.total_debts || 0).toString()],
            ['Monto Deudas', `$${statistics?.total_debt_amount || 0}`],
            ['Total Categorías', (statistics?.total_categories || 0).toString()],
            ['Total Proveedores', (statistics?.total_providers || 0).toString()]
          ];
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      await generateExcelReport({
        title,
        columns,
        data: rows,
        companySettings,
        fileName: `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`
      });

      toast.success(`Reporte Excel de ${getReportName(reportType)} descargado exitosamente!`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw error;
    }
  };

  const downloadPDFReport = async (reportType) => {
    try {
      // Fetch data based on report type
      let title;
      let columns;
      let rows;

      switch (reportType) {
        case 'products': {
          const productsRes = await api.get('/products');
          const data = productsRes.data;
          title = 'Reporte de Productos';
          columns = ['ID', 'Nombre', 'Precio', 'Existencias', 'Categoría'];
          rows = data.map(p => [
            p.id.toString(),
            p.name,
            `$${p.price}`,
            p.existencias.toString(),
            p.category?.nombre || 'N/A'
          ]);
          break;
        }
        case 'sales': {
          const salesRes = await api.get('/sales');
          const data = salesRes.data;
          title = 'Reporte de Ventas';
          columns = ['ID', 'Empleado', 'Total', 'Fecha'];
          rows = data.map(s => [
            s.id.toString(),
            s.user?.name || 'N/A',
            `$${s.total_venta}`,
            new Date(s.created_at).toLocaleDateString()
          ]);
          break;
        }
        case 'debts': {
          const debtsRes = await api.get('/debts');
          const data = debtsRes.data;
          title = 'Reporte de Deudas';
          columns = ['ID', 'Empleado', 'Monto', 'Descripción', 'Pagada'];
          rows = data.map(d => [
            d.id.toString(),
            d.user?.name || 'N/A',
            `$${d.monto}`,
            d.description || '',
            d.pagada ? 'Sí' : 'No'
          ]);
          break;
        }
        case 'general':
          title = 'Reporte General';
          columns = ['Estadística', 'Valor'];
          rows = [
            ['Total Productos', (statistics?.total_products || 0).toString()],
            ['Total Stock', (statistics?.total_stock || 0).toString()],
            ['Total Ventas', (statistics?.total_sales || 0).toString()],
            ['Monto Ventas', `$${statistics?.total_sales_amount || 0}`],
            ['Deudas Pendientes', (statistics?.total_debts || 0).toString()],
            ['Monto Deudas', `$${statistics?.total_debt_amount || 0}`],
            ['Total Categorías', (statistics?.total_categories || 0).toString()],
            ['Total Proveedores', (statistics?.total_providers || 0).toString()]
          ];
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      // Get logo as base64 if available
      const logoDataUrl = await getCompanyLogoBase64(companySettings.logo);

      // Generate PDF using @react-pdf/renderer
      const blob = await pdf(
        <PDFDocument 
          title={title}
          data={rows}
          columns={columns}
          companySettings={companySettings}
          logoDataUrl={logoDataUrl}
        />
      ).toBlob();

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Reporte PDF de ${getReportName(reportType)} descargado exitosamente!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 transition-colors duration-200" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color: color }} />
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ title, description, icon: Icon, type, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color: color }} />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadReport(type, 'excel')}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Descargar Excel"
          >
            <FileSpreadsheet size={16} />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={() => downloadReport(type, 'pdf')}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Descargar PDF"
          >
            <Download size={16} />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reportes</h1>
        <p className="text-gray-600 dark:text-gray-400">Genera y descarga reportes detallados en formato Excel o PDF</p>
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
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-start space-x-3">
          <FileText className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Información sobre los Reportes</h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
              <li>• Los reportes se generan en tiempo real con los datos más actualizados</li>
              <li>• Puedes descargar en formato Excel (.xlsx) o PDF</li>
              <li>• Los reportes PDF incluyen el logo y datos de la empresa</li>
              <li>• El reporte general incluye estadísticas completas del sistema</li>
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