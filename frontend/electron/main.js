const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Determinar si estamos en desarrollo o producción
  const isDev = !app.isPackaged;
  
  // Ruta del icono según el entorno
  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, '..', 'public', 'app-icon.png');
  } else {
    // En producción, usar el PNG dentro del paquete (asar)
    // __dirname apunta a ".../resources/app.asar/electron", por lo que subimos y vamos a public/
    iconPath = path.join(__dirname, '..', 'public', 'icon.ico');
  }
  
  console.log('Icon path:', iconPath);
  console.log('Icon exists:', require('fs').existsSync(iconPath));

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#f3f4f6',
    show: false,
    frame: true,
    titleBarStyle: 'default',
    title: 'Sistema Inventario Mi Ángel'
  });

  // En desarrollo, carga desde Vite
  // En producción, carga desde dist
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, dist está al mismo nivel que electron/
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  
  // Log de errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error al cargar:', errorCode, errorDescription);
  });

  // Manejar cierre de ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevenir navegación externa
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Inicializar app
app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', `Ha ocurrido un error: ${error.message}`);
});

// IPC Handlers para comunicación con el renderer
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
