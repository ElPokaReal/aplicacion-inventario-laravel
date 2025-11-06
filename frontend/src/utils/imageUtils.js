import { isElectron } from './electron';

/**
 * Convierte una imagen a base64
 * Compatible con Electron y navegador web
 */
export const imageToBase64 = async (imagePath) => {
  try {
    // Normalizar la ruta
    let fullPath = imagePath;
    
    if (!imagePath.startsWith('http')) {
      // Asegurar que la ruta comience con /
      const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      fullPath = window.location.origin + normalizedPath;
    }

    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

/**
 * Obtiene el logo de la empresa como base64
 */
export const getCompanyLogoBase64 = async (logoPath) => {
  try {
    // En Electron, las rutas son relativas
    if (isElectron()) {
      // Intentar cargar desde public
      const paths = [
        logoPath,
        '/logo.png',
        './logo.png',
        '../public/logo.png'
      ];

      for (const path of paths) {
        try {
          const base64 = await imageToBase64(path);
          if (base64) return base64;
        } catch {
          continue;
        }
      }
    } else {
      // En web, usar la ruta directamente
      return await imageToBase64(logoPath);
    }
  } catch (error) {
    console.error('Error loading company logo:', error);
  }
  
  return null;
};

