import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { UserPlus, Mail, User, Key, Eye, EyeOff, AlertCircle, Shield, CheckCircle, Package, TrendingUp, Users as UsersIcon } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('empleado');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { companySettings } = useTheme();

  const validateForm = () => {
    const newErrors = {};
    
    if (!name || name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: 'Débil', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Media', color: 'bg-yellow-500' };
    return { strength, label: 'Fuerte', color: 'bg-green-500' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role: role,
      });
      const user = response.data.user;
      const token = response.data.token;
      
      // Guardar el token en localStorage
      if (token) {
        localStorage.setItem('token', token);
      }
      
      setUser(user);
      toast.success(`¡Bienvenido, ${user.name}! Tu cuenta ha sido creada exitosamente.`);
      
      const isAdmin = user.roles && user.roles.some(r => r.name === 'admin');
      navigate(isAdmin ? '/admin/dashboard' : '/shop');
    } catch (err) {
      console.error('Register error:', err);
      
      if (err.response) {
        if (err.response.status === 422) {
          const serverErrors = err.response.data.errors || {};
          setErrors(serverErrors);
          toast.error('Por favor, verifica los datos ingresados');
        } else if (err.response.data?.message) {
          setErrors({ general: err.response.data.message });
          toast.error(err.response.data.message);
        } else {
          setErrors({ general: 'Error al crear la cuenta. Por favor, intenta nuevamente.' });
          toast.error('Error en el registro');
        }
      } else {
        setErrors({ general: 'No se pudo conectar con el servidor. Verifica tu conexión.' });
        toast.error('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center relative overflow-hidden">
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
          <p className="text-purple-200 text-lg">RIF: {companySettings.rif}</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
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
          <div className="mb-6">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
              <UserPlus className="h-8 w-8 text-purple-600" />
              <h3 className="text-3xl font-bold text-gray-900">Crear Cuenta</h3>
            </div>
            <p className="text-gray-600 text-center lg:text-left">Completa el formulario para registrarte</p>
          </div>

          {/* Role Toggle */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Tipo de Cuenta</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setRole('empleado')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                  role === 'empleado'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={18} />
                <span className="font-medium">Empleado</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield size={18} />
                <span className="font-medium">Administrador</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Error general */}
          {errors.general && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
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
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Fortaleza:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? 'text-red-600' :
                      passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    if (errors.passwordConfirmation) setErrors({ ...errors, passwordConfirmation: null });
                  }}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.passwordConfirmation}
                </p>
              )}
              {passwordConfirmation && password === passwordConfirmation && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Las contraseñas coinciden
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Crear Cuenta
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Inicia sesión aquí
                </Link>
              </span>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;