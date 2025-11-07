const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Manejar eventos de instalación/actualización de Squirrel
function handleSquirrelEvent(app) {
  if (process.argv.length === 1) {
    return false;
  }

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawnUpdate = function(args) {
    let spawnedProcess;
    try {
      spawnedProcess = spawn(updateDotExe, args, { detached: true });
    } catch (error) {
      console.error('Error spawning Update.exe:', error);
    }
    return spawnedProcess;
  };

  const squirrelEvent = process.argv[1];

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Crear accesos directos en escritorio y menú inicio
      spawnUpdate(['--createShortcut', exeName]);
      
      // Mostrar notificación de instalación completada
      setTimeout(() => {
        const { Notification } = require('electron');
        
        if (Notification.isSupported()) {
          const notification = new Notification({
            title: '✅ Instalación Completada',
            body: 'Inventario Mi Ángel se instaló correctamente.\nBúscalo en el menú inicio o escritorio.',
            icon: path.join(appFolder, 'resources', 'app.asar', 'public', 'icon.png'),
            silent: false
          });
          
          notification.show();
          
          // Abrir la app cuando se hace clic en la notificación
          notification.on('click', () => {
            // La app se abrirá automáticamente después
          });
        }
      }, 500);
      
      setTimeout(() => {
        app.quit();
      }, 2000);
      
      return true;

    case '--squirrel-uninstall':
      // Remover accesos directos
      spawnUpdate(['--removeShortcut', exeName]);
      
      setTimeout(() => {
        app.quit();
      }, 1000);
      
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }

  return false;
}

module.exports = handleSquirrelEvent;
