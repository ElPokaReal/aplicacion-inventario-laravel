import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando panel de control...</div>;
  }

  if (!user) {
    return <div>Por favor, inicia sesión para ver el panel de control.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>¡Bienvenido, {user.name}!</h2>
      {user.roles && user.roles.some(role => role.name === 'admin') ? (
        <p>Tienes privilegios de administrador. Puedes gestionar productos, proveedores, categorías, usuarios, ventas y deudas.</p>
      ) : (
        <p>Has iniciado sesión como usuario normal. Puedes ver tus ventas y tus deudas.</p>
      )}
      <p>Este es tu panel de control. Más funcionalidades serán añadidas aquí.</p>

      {user.roles && user.roles.some(role => role.name === 'admin') && (
        <div className="row mt-4">
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-primary mb-3">
              <div className="card-header">Total de Productos</div>
              <div className="card-body">
                <h5 className="card-title">150</h5>
                <p className="card-text">Actualmente en stock.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-header">Ventas Totales (Hoy)</div>
              <div className="card-body">
                <h5 className="card-title">$1,200.00</h5>
                <p className="card-text">Ingresos generados hoy.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-header">Deudas Pendientes</div>
              <div className="card-body">
                <h5 className="card-title">$500.00</h5>
                <p className="card-text">Total de deudas pendientes.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;