const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'Inventario Mi Ángel',
    executableName: 'inventario-mi-angel',
    appBundleId: 'com.miangel.inventario',
    appCopyright: 'Copyright © 2025 Comercializadora Mi Ángel',
    icon: path.join(__dirname, 'public', 'icon'), // Sin extensión - Forge busca .ico/.icns/.png automáticamente
    asar: true,
    extraResource: [
      path.join(__dirname, 'public', 'icon.png')
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // Nombre interno (sin espacios)
        name: 'inventario_mi_angel',
        
        // Información del instalador
        authors: 'Comercializadora Mi Ángel',
        description: 'Sistema de Gestión de Inventario - Comercializadora Mi Ángel',
        title: 'Inventario Mi Ángel',
        
        // Nombre del archivo instalador
        setupExe: 'Inventario-Mi-Angel-Setup.exe',
        
        // Icono del instalador (.ico válido)
        setupIcon: path.join(__dirname, 'public', 'icon.ico'),
        
        // GIF animado durante la instalación (opcional)
        loadingGif: path.join(__dirname, 'public', 'installing.gif'), // Si tienes uno
        
        // URL del icono (para actualizaciones remotas)
        iconUrl: 'https://raw.githubusercontent.com/electron/electron/main/shell/browser/resources/win/electron.ico',
        
        // No crear instalador MSI (solo .exe)
        noMsi: true,
        
        // Configuración de accesos directos
        remoteReleases: false,
        
        // Certificado de firma de código (opcional, para producción)
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERT_PASSWORD,
        
        // Configuración de Delta updates (actualizaciones incrementales)
        // frameworkVersion: 'net6.0'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux']
    }
  ],
  plugins: [],
  hooks: {
    packageAfterCopy: async (config, buildPath) => {
      // Copiar dist al buildPath
      const fs = require('fs-extra');
      const distPath = path.join(__dirname, 'dist');
      const targetPath = path.join(buildPath, 'dist');
      await fs.copy(distPath, targetPath);
    }
  }
};
