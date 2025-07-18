import React from 'react';
import AppRoutes from './routes';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Layout>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </Layout>
  );
}

export default App;