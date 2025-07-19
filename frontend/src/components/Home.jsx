import React from 'react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          ¡Bienvenido a la Aplicación de Inventario!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Por favor, inicia sesión o regístrate para continuar.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/login" 
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Iniciar Sesión
          </a>
          <a 
            href="/register" 
            className="bg-secondary-200 text-secondary-800 px-6 py-3 rounded-lg font-medium hover:bg-secondary-300 transition-colors duration-200"
          >
            Registrarse
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
