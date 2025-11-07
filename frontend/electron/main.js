const { app, BrowserWindow, ipcMain, dialog, session } = require('electron');
const path = require('path');
const fs = require('fs');
const handleSquirrelEvent = require('./squirrel-events');

// Manejar eventos de Squirrel (instalación/actualización/desinstalación)
if (require('electron-squirrel-startup') || handleSquirrelEvent(app)) {
  app.quit();
}

let mainWindow;
let welcomeWindow;

function getIconPath() {
  const isDev = !app.isPackaged;
  const platform = process.platform;
  
  // Determinar la ruta base según el entorno
  const baseDir = isDev 
    ? path.join(__dirname, '..', 'public')
    : path.join(process.resourcesPath, 'app.asar', 'public');
  
  // Usar PNG para todas las plataformas (electron-builder lo convierte automáticamente)
  const iconFile = 'icon.png';
  const iconPath = path.join(baseDir, iconFile);
  
  // Log para debugging
  console.log('Platform:', platform);
  console.log('Is Dev:', isDev);
  console.log('Icon path:', iconPath);
  console.log('Icon exists:', require('fs').existsSync(iconPath));
  
  return iconPath;
}

function createWindow() {
  // Determinar si estamos en desarrollo o producción
  const isDev = !app.isPackaged;
  
  // Configurar la sesión para persistir datos (localStorage, cookies, etc.)
  const ses = session.defaultSession;
  
  // Habilitar persistencia de datos
  ses.setUserAgent(ses.getUserAgent() + ' ElectronApp');
  
  // Configurar partición de sesión persistente
  const partition = 'persist:inventario';
  
  // Obtener ruta del icono según la plataforma
  const iconPath = getIconPath();

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
      preload: path.join(__dirname, 'preload.js'),
      partition: partition, // Usar partición persistente
      webSecurity: true
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

// Verificar si es la primera ejecución
function isFirstRun() {
  const userDataPath = app.getPath('userData');
  const firstRunFile = path.join(userDataPath, '.first-run-complete');
  
  if (fs.existsSync(firstRunFile)) {
    return false;
  }
  
  // Crear el archivo para marcar que ya se ejecutó
  try {
    fs.writeFileSync(firstRunFile, new Date().toISOString());
  } catch (err) {
    console.error('Error creating first run file:', err);
  }
  
  return true;
}

// Crear ventana de bienvenida
function createWelcomeWindow() {
  const isDev = !app.isPackaged;
  
  welcomeWindow = new BrowserWindow({
    width: 600,
    height: 700,
    resizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const welcomePath = isDev
    ? path.join(__dirname, '..', 'public', 'welcome.html')
    : path.join(process.resourcesPath, 'app.asar', 'public', 'welcome.html');

  welcomeWindow.loadFile(welcomePath);

  // Cerrar ventana de bienvenida y abrir la principal
  welcomeWindow.on('closed', () => {
    welcomeWindow = null;
    createWindow();
  });

  // Auto-cerrar después de 10 segundos
  setTimeout(() => {
    if (welcomeWindow && !welcomeWindow.isDestroyed()) {
      welcomeWindow.close();
    }
  }, 10000);
}

// Inicializar app
app.whenReady().then(() => {
  if (isFirstRun()) {
    createWelcomeWindow();
  } else {
    createWindow();
  }
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

ipcMain.handle('close-welcome', () => {
  if (welcomeWindow && !welcomeWindow.isDestroyed()) {
    welcomeWindow.close();
  }
});
