// Utilidades para Electron

/**
 * Verifica si la aplicación está corriendo en Electron
 */
export const isElectron = () => {
  return window.electron && window.electron.isElectron === true;
};

/**
 * Obtiene la ruta correcta para recursos estáticos
 * En Electron usa rutas relativas, en web usa rutas absolutas
 */
export const getAssetPath = (path) => {
  if (isElectron()) {
    // En Electron, las rutas son relativas al index.html
    return path.startsWith('/') ? `.${path}` : path;
  }
  // En web, usar rutas absolutas
  return path;
};

/**
 * Obtiene la versión de la aplicación
 */
export const getAppVersion = async () => {
  if (isElectron() && window.electron.getAppVersion) {
    return await window.electron.getAppVersion();
  }
  return '1.0.0';
};

/**
 * Obtiene el path de datos de la aplicación
 */
export const getAppPath = async () => {
  if (isElectron() && window.electron.getAppPath) {
    return await window.electron.getAppPath();
  }
  return null;
};

/**
 * Obtiene la plataforma del sistema operativo
 */
export const getPlatform = () => {
  if (isElectron() && window.electron.platform) {
    return window.electron.platform;
  }
  return navigator.platform;
};
