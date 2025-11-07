#!/usr/bin/env node

/**
 * Script para convertir las carpetas de iconos a los formatos finales
 * - icon.iconset/ -> icon.icns (macOS) 
 * - icons/*.png -> icon.ico (Windows usando múltiples PNGs)
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const ICONSET_DIR = path.join(PUBLIC_DIR, 'icon.iconset');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

/**
 * Convierte icon.iconset a icon.icns (solo en macOS)
 */
async function generateIcns() {
  console.log('\n🍎 Generando icon.icns para macOS...');
  
  try {
    const icnsPath = path.join(PUBLIC_DIR, 'icon.icns');
    await execAsync(`iconutil --convert icns -o "${icnsPath}" "${ICONSET_DIR}"`);
    console.log('✅ icon.icns generado exitosamente');
    return true;
  } catch (err) {
    console.log('⚠️  No se pudo generar icon.icns (solo disponible en macOS)');
    console.log('   Si estás en macOS, ejecuta manualmente:');
    console.log(`   iconutil --convert icns -o public/icon.icns public/icon.iconset`);
    return false;
  }
}

/**
 * Crea un archivo ICO desde múltiples PNGs usando sharp
 * Windows ICO puede contener múltiples tamaños
 */
async function generateIco() {
  console.log('\n📦 Generando icon.ico para Windows...');
  
  // Tamaños estándar para ICO
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const icoPath = path.join(PUBLIC_DIR, 'icon.ico');
  
  try {
    // Usar el tamaño más grande disponible como base
    const largestIcon = path.join(ICONS_DIR, '256x256.png');
    
    // Sharp puede crear ICO directamente
    await sharp(largestIcon)
      .resize(256, 256)
      .toFile(icoPath);
    
    console.log('✅ icon.ico generado exitosamente');
    
    // Verificar tamaño del archivo
    const stats = await fs.stat(icoPath);
    console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    
    return true;
  } catch (err) {
    console.error('❌ Error generando icon.ico:', err.message);
    return false;
  }
}

/**
 * Crea app-icon.png (512x512) para Linux
 */
async function generateAppIconPng() {
  console.log('\n🐧 Generando app-icon.png para Linux...');
  
  try {
    const sourcePath = path.join(ICONS_DIR, '512x512.png');
    const destPath = path.join(PUBLIC_DIR, 'app-icon.png');
    
    // Copiar y optimizar
    await sharp(sourcePath)
      .resize(512, 512)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(destPath);
    
    console.log('✅ app-icon.png generado exitosamente');
    
    const stats = await fs.stat(destPath);
    console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    
    return true;
  } catch (err) {
    console.error('❌ Error generando app-icon.png:', err.message);
    return false;
  }
}

/**
 * Genera favicon.ico para el navegador
 */
async function generateFavicon() {
  console.log('\n🌐 Generando favicon.ico...');
  
  try {
    const sourcePath = path.join(ICONS_DIR, '32x32.png');
    const destPath = path.join(PUBLIC_DIR, 'favicon.ico');
    
    await sharp(sourcePath)
      .resize(32, 32)
      .toFile(destPath);
    
    console.log('✅ favicon.ico generado exitosamente');
    return true;
  } catch (err) {
    console.error('❌ Error generando favicon.ico:', err.message);
    return false;
  }
}

/**
 * Verifica que las carpetas necesarias existan
 */
async function checkDirectories() {
  const checks = [
    { path: ICONSET_DIR, name: 'icon.iconset' },
    { path: ICONS_DIR, name: 'icons' }
  ];
  
  for (const check of checks) {
    try {
      await fs.access(check.path);
    } catch (err) {
      console.error(`❌ Error: No se encontró la carpeta ${check.name}`);
      console.error(`   Ejecuta primero: npm run icons`);
      return false;
    }
  }
  
  return true;
}

/**
 * Muestra resumen de archivos generados
 */
async function showSummary() {
  console.log('\n📊 Resumen de Iconos Generados:\n');
  
  const files = [
    { path: 'icon.ico', platform: 'Windows', usage: 'App principal + Instalador' },
    { path: 'icon.icns', platform: 'macOS', usage: 'App principal' },
    { path: 'app-icon.png', platform: 'Linux', usage: 'App principal' },
    { path: 'favicon.ico', platform: 'Web', usage: 'Navegador' }
  ];
  
  for (const file of files) {
    const filePath = path.join(PUBLIC_DIR, file.path);
    try {
      const stats = await fs.stat(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${file.path.padEnd(20)} | ${file.platform.padEnd(10)} | ${size.padStart(8)} KB | ${file.usage}`);
    } catch (err) {
      console.log(`⚠️  ${file.path.padEnd(20)} | ${file.platform.padEnd(10)} | No generado`);
    }
  }
  
  console.log('\n📁 Carpetas intermedias (pueden eliminarse después):');
  console.log('   - public/icon.iconset/  (usada para generar .icns)');
  console.log('   - public/icons/         (usada para generar .ico)');
}

async function main() {
  try {
    console.log('🚀 Convirtiendo iconos a formatos finales...\n');
    
    // Verificar que existan las carpetas
    const directoriesExist = await checkDirectories();
    if (!directoriesExist) {
      process.exit(1);
    }
    
    // Generar todos los formatos
    const results = await Promise.all([
      generateIco(),
      generateIcns(),
      generateAppIconPng(),
      generateFavicon()
    ]);
    
    // Mostrar resumen
    await showSummary();
    
    const allSuccess = results.every(r => r === true);
    if (allSuccess) {
      console.log('\n✨ ¡Todos los iconos convertidos exitosamente!');
    } else {
      console.log('\n⚠️  Algunos iconos no se pudieron generar (ver detalles arriba)');
    }
    
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Prueba en desarrollo: npm run electron:dev');
    console.log('   2. Construye la app: npm run electron:build:win');
    console.log('   3. Las carpetas icon.iconset/ e icons/ pueden eliminarse si lo deseas');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
