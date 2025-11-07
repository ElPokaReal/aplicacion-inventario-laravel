#!/usr/bin/env node

/**
 * Script para generar iconos de aplicación para Electron
 * Genera .ico para Windows, .icns para macOS, y .png para Linux
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../public/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Tamaños necesarios para diferentes plataformas
const SIZES = {
  windows: [16, 20, 24, 32, 40, 48, 60, 64, 72, 80, 96, 128, 256],
  mac: [16, 32, 64, 128, 256, 512, 1024],
  linux: [16, 22, 24, 32, 36, 48, 64, 72, 96, 128, 192, 256, 512],
};

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function generatePngIcon(size, outputPath) {
  console.log(`Generando ${path.basename(outputPath)} (${size}x${size})...`);
  
  await sharp(INPUT_FILE)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(outputPath);
}

async function generateWindowsIcons() {
  console.log('\n📦 Generando iconos para Windows...');
  
  const tempDir = path.join(OUTPUT_DIR, 'temp-icons');
  await ensureDir(tempDir);
  
  // Generar PNGs temporales
  const pngFiles = [];
  for (const size of SIZES.windows) {
    const outputPath = path.join(tempDir, `icon-${size}.png`);
    await generatePngIcon(size, outputPath);
    pngFiles.push(outputPath);
  }
  
  // Convertir a ICO usando sharp
  console.log('Creando icon.ico...');
  
  // Para ICO, usamos el tamaño más grande y dejamos que Windows lo escale
  await sharp(INPUT_FILE)
    .resize(256, 256, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(path.join(OUTPUT_DIR, 'icon.ico'));
  
  // Limpiar archivos temporales
  await fs.rm(tempDir, { recursive: true, force: true });
  
  console.log('✅ icon.ico generado');
}

async function generateMacIcons() {
  console.log('\n🍎 Generando iconos para macOS...');
  
  const iconsetDir = path.join(OUTPUT_DIR, 'icon.iconset');
  await ensureDir(iconsetDir);
  
  for (const size of SIZES.mac) {
    if (size !== 1024) {
      await generatePngIcon(size, path.join(iconsetDir, `icon_${size}x${size}.png`));
    }
    
    if (size !== 16) {
      const half = size / 2;
      await generatePngIcon(size, path.join(iconsetDir, `icon_${half}x${half}@2x.png`));
    }
  }
  
  console.log('✅ Iconos para macOS generados en icon.iconset/');
  console.log('   Para crear .icns en macOS, ejecuta: iconutil --convert icns -o icon.icns icon.iconset');
}

async function generateLinuxIcons() {
  console.log('\n🐧 Generando iconos para Linux...');
  
  const iconsDir = path.join(OUTPUT_DIR, 'icons');
  await ensureDir(iconsDir);
  
  for (const size of SIZES.linux) {
    await generatePngIcon(size, path.join(iconsDir, `${size}x${size}.png`));
  }
  
  console.log('✅ Iconos para Linux generados en icons/');
}

async function generateAppIcon() {
  console.log('\n🎨 Generando app-icon.ico y app-icon.png...');
  
  // Generar PNG de 512x512
  await sharp(INPUT_FILE)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'app-icon.png'));
  
  // Generar ICO de 256x256
  await sharp(INPUT_FILE)
    .resize(256, 256, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(path.join(OUTPUT_DIR, 'app-icon.ico'));
  
  console.log('✅ app-icon.ico y app-icon.png generados');
}

async function main() {
  try {
    console.log('🚀 Iniciando generación de iconos...');
    console.log(`📁 Archivo de entrada: ${INPUT_FILE}`);
    console.log(`📁 Directorio de salida: ${OUTPUT_DIR}\n`);
    
    // Verificar que el archivo de entrada existe
    try {
      await fs.access(INPUT_FILE);
    } catch (err) {
      console.error(`❌ Error: No se encontró el archivo ${INPUT_FILE}`);
      process.exit(1);
    }
    
    await generateWindowsIcons();
    await generateMacIcons();
    await generateLinuxIcons();
    await generateAppIcon();
    
    console.log('\n✨ ¡Todos los iconos generados exitosamente!');
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
    process.exit(1);
  }
}

main();
