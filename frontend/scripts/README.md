# Scripts de Generación de Iconos

Scripts para generar todos los iconos necesarios para la aplicación Electron desde el logo base.

## 📋 Requisitos

- Node.js instalado
- Sharp (ya incluido en devDependencies)
- ImageMagick (opcional, solo para `generate-icons-magick.js`)

## 🚀 Uso Rápido

### Generar todos los iconos (Recomendado)
```bash
npm run icons:all
```

Este comando genera:
- ✅ Iconos de aplicación para Windows, macOS y Linux
- ✅ Iconos de bandeja del sistema (tray icons)

### Comandos Individuales

#### 1. Iconos de Aplicación
```bash
npm run icons
```

Genera:
- `public/icon.ico` - Icono principal para Windows (256x256)
- `public/app-icon.ico` - Icono alternativo (256x256)
- `public/app-icon.png` - Icono PNG (512x512)
- `public/icon.iconset/` - Iconos para macOS (.icns)
- `public/icons/` - Iconos para Linux (múltiples tamaños)

#### 2. Iconos de Bandeja del Sistema
```bash
npm run icons:tray
```

Genera en `public/tray-icons/`:
- `trayIcon*.png` - Iconos base (Windows/Linux)
- `trayIconTemplate*.png` - Iconos template (macOS)
- `trayIconUpdateAvailable*.png` - Con badge de notificación
- `trayIconCheckingForUpdates*.png` - Con spinner

Cada icono se genera en 4 escalas: 1x, 2x, 3x, 4x

#### 3. Usando ImageMagick (Alternativo)
```bash
npm run icons:magick
```

**Requisitos adicionales:**
- Descargar e instalar [ImageMagick](https://imagemagick.org/script/download.php#windows)
- Asegurarse de que `magick` esté en el PATH del sistema

Este método produce iconos de mayor calidad pero requiere software adicional.

## 📁 Estructura de Salida

```
frontend/
├── public/
│   ├── icon.ico              # Icono principal Windows
│   ├── app-icon.ico          # Icono alternativo
│   ├── app-icon.png          # Icono PNG 512x512
│   ├── icon.iconset/         # Iconos macOS
│   │   ├── icon_16x16.png
│   │   ├── icon_32x32.png
│   │   └── ...
│   ├── icons/                # Iconos Linux
│   │   ├── 16x16.png
│   │   ├── 32x32.png
│   │   └── ...
│   └── tray-icons/           # Iconos de bandeja
│       ├── trayIcon.png
│       ├── trayIcon@2x.png
│       └── ...
```

## 🔧 Configuración de electron-builder

Los iconos generados están configurados en `package.json`:

```json
{
  "build": {
    "win": {
      "icon": "public/icon.ico"
    },
    "mac": {
      "icon": "public/app-icon.ico"
    },
    "linux": {
      "icon": "public/app-icon.ico"
    }
  }
}
```

## 📝 Notas

### Para macOS (.icns)
Si estás en macOS y quieres generar el archivo `.icns`:
```bash
iconutil --convert icns -o public/icon.icns public/icon.iconset
```

### Personalización
Para cambiar el logo base, reemplaza `public/logo.png` y vuelve a ejecutar los scripts.

### Tamaños Generados

**Windows (.ico):**
- 16, 20, 24, 32, 40, 48, 60, 64, 72, 80, 96, 128, 256 px

**macOS (.icns):**
- 16, 32, 64, 128, 256, 512, 1024 px (con versiones @2x)

**Linux (.png):**
- 16, 22, 24, 32, 36, 48, 64, 72, 96, 128, 192, 256, 512 px

**Tray Icons:**
- 16px base con escalas 1x, 2x, 3x, 4x

## 🐛 Solución de Problemas

### Error: "Cannot find module"
Asegúrate de que las dependencias estén instaladas:
```bash
npm install
```

### Error: "ImageMagick no está instalado"
Solo para `icons:magick`. Usa `npm run icons` en su lugar.

### Los iconos se ven borrosos
- Asegúrate de que `logo.png` tenga al menos 1024x1024 px
- Usa `npm run icons:magick` para mejor calidad (requiere ImageMagick)

## 📚 Referencias

- [electron-builder Icons](https://www.electron.build/icons)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [ImageMagick](https://imagemagick.org/)
