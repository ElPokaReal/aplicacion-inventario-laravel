import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Layout from '../components/Layout';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Dashboard from '../components/Dashboard';
import Products from '../components/Products';
import Providers from '../components/Providers';
import Sales from '../components/Sales';
import Debts from '../components/Debts';
import Categories from '../components/Categories';
import ProtectedRoute from '../components/ProtectedRoute';
import Shop from '../components/Shop';
import Cart from '../components/Cart';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute adminOnly={true}><Products /></ProtectedRoute>} />
      <Route path="/providers" element={<ProtectedRoute adminOnly={true}><Providers /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/debts" element={<ProtectedRoute><Debts /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute adminOnly={true}><Categories /></ProtectedRoute>} />
      <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
