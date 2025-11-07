import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { LogIn, Mail, Key, AlertCircle, Eye, EyeOff, Package, TrendingUp, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { companySettings } = useTheme();

  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/login', { email, password });
      console.log('Login response:', response.data);
      
      const user = response.data.user;
      const token = response.data.token;
      
      if (!user) {
        throw new Error('No se recibió información del usuario');
      }
      
      // Guardar el token en localStorage
      if (token) {
        localStorage.setItem('token', token);
      }
      
      setUser(user);

      toast.success(`¡Bienvenido, ${user.name}!`);

      const isAdmin = user.roles && user.roles.some(role => role.name === 'admin');
      
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/shop');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response) {
        // Error del servidor
        const errorMessage = err.response.data?.message || '';
        
        if (err.response.status === 401 || errorMessage.includes('credentials') || errorMessage.includes('do not match')) {
          setErrors({
            general: 'Las credenciales no coinciden con nuestros registros. Por favor, verifica tu correo y contraseña.'
          });
          toast.error('Credenciales incorrectas');
        } else if (err.response.status === 422) {
          // Errores de validación del servidor
          const serverErrors = err.response.data.errors || {};
          setErrors(serverErrors);
          toast.error('Por favor, verifica los datos ingresados');
        } else if (err.response.status === 429) {
          setErrors({
            general: 'Demasiados intentos de inicio de sesión. Por favor, espera unos minutos.'
          });
          toast.error('Demasiados intentos');
        } else if (err.response.status === 419) {
          setErrors({
            general: 'La sesión ha expirado. Por favor, recarga la página e intenta nuevamente.'
          });
          toast.error('Sesión expirada');
        } else {
          setErrors({
            general: `Error al iniciar sesión: ${errorMessage || 'Por favor, intenta nuevamente.'}`
          });
          toast.error('Error al iniciar sesión');
        }
      } else if (err.request) {
        // Error de red
        setErrors({
          general: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        });
        toast.error('Error de conexión');
      } else {
        setErrors({
          general: err.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
        });
        toast.error('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
        
        <div className="relative z-10 text-center">
          <img 
            src={companySettings.logo} 
            alt={companySettings.name}
            className="h-64 w-64 object-contain mx-auto mb-8 drop-shadow-2xl"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-4xl font-bold text-white mb-2">{companySettings.name}</h1>
          <p className="text-blue-200 text-lg">RIF: {companySettings.rif}</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src={companySettings.logo} 
              alt={companySettings.name}
              className="h-16 w-16 object-contain mx-auto mb-3"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="text-2xl font-bold text-gray-900">{companySettings.name}</h2>
            <p className="text-sm text-gray-600">RIF: {companySettings.rif}</p>
          </div>

          {/* Form Title */}
          <div>
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
              <LogIn className="h-8 w-8 text-primary-600" />
              <h3 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h3>
            </div>
            <p className="text-gray-600 text-center lg:text-left">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
