import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Layout from '../components/Layout';
import Login from '../components/Auth/Login';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import Dashboard from '../components/Dashboard';
import DashboardRedirect from '../components/DashboardRedirect';
import Products from '../components/Products';
import Providers from '../components/Providers';
import Sales from '../components/Sales';
import Debts from '../components/Debts';
import Categories from '../components/Categories';
import Reports from '../components/Reports';
import Users from '../components/Users';
import ProtectedRoute from '../components/ProtectedRoute';
import Shop from '../components/Shop';
import Cart from '../components/Cart';
import UserLayout from '../components/UserLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Ruta dashboard genérica que redirije según el rol */}
      <Route 
        path="/dashboard"
        element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>}
      />

      {/* Rutas de Administrador */}
      <Route 
        path="/admin/dashboard"
        element={<ProtectedRoute adminOnly={true}><Layout><Dashboard /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/products"
        element={<ProtectedRoute adminOnly={true}><Layout><Products /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/providers"
        element={<ProtectedRoute adminOnly={true}><Layout><Providers /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/sales"
        element={<ProtectedRoute adminOnly={true}><Layout><Sales /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/debts"
        element={<ProtectedRoute adminOnly={true}><Layout><Debts /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/categories"
        element={<ProtectedRoute adminOnly={true}><Layout><Categories /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/reports"
        element={<ProtectedRoute adminOnly={true}><Layout><Reports /></Layout></ProtectedRoute>}
      />
      <Route 
        path="/admin/users"
        element={<ProtectedRoute adminOnly={true}><Layout><Users /></Layout></ProtectedRoute>}
      />

      {/* Rutas de Usuario */}
      <Route 
        path="/"
        element={<ProtectedRoute><UserLayout /></ProtectedRoute>}
      >
        <Route index element={<Shop />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
