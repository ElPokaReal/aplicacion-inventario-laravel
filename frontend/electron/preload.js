const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electron', {
  // Información de la app
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Indicar que estamos en Electron
  isElectron: true,
  
  // Platform info
  platform: process.platform
});

// API para la ventana de bienvenida
contextBridge.exposeInMainWorld('electronAPI', {
  closeWelcome: () => ipcRenderer.invoke('close-welcome')
});

// Prevenir que el renderer acceda directamente a Node.js
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron Preload Script Loaded');
});
