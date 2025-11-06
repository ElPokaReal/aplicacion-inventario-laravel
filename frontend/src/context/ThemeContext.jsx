import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [companySettings, setCompanySettings] = useState(() => {
    const savedSettings = localStorage.getItem('companySettings');
    
    // Determinar la ruta correcta del logo según el entorno
    const isElectron = window.location.protocol === 'file:';
    const logoPath = isElectron ? './logo.png' : '/logo.png';
    
    const defaultSettings = {
      name: 'Comercializadora Mi Ángel',
      rif: 'J-16463127-0',
      logo: logoPath
    };
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
  }, [companySettings]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateCompanySettings = (newSettings) => {
    setCompanySettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      companySettings, 
      updateCompanySettings 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
