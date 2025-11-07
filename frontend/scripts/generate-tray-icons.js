#!/usr/bin/env node

/**
 * Script para generar iconos de bandeja del sistema (tray icons)
 * Genera versiones normales, con notificación y con spinner
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../public/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public/tray-icons');
const BASE_SIZE = 16;

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function generateTrayIcon(inputBuffer, size, namePrefix, isTemplate = false) {
  const scales = [1, 2, 3, 4];
  
  for (const scale of scales) {
    const scaledSize = size * scale;
    const suffix = scale === 1 ? '' : `@${scale}x`;
    const filename = `${namePrefix}${suffix}.png`;
    
    console.log(`  Generando ${filename} (${scaledSize}x${scaledSize})...`);
    
    let pipeline = sharp(inputBuffer).resize(scaledSize, scaledSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
    
    // Para templates de macOS, convertir a escala de grises
    if (isTemplate) {
      pipeline = pipeline.grayscale();
    }
    
    await pipeline.png().toFile(path.join(OUTPUT_DIR, filename));
  }
}

async function createNotificationBadge(size) {
  const badgeSize = Math.floor(size * 0.4);
  const svgBadge = `
    <svg width="${badgeSize}" height="${badgeSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${badgeSize/2}" cy="${badgeSize/2}" r="${badgeSize/2}" fill="#ff0000"/>
    </svg>
  `;
  
  return Buffer.from(svgBadge);
}

async function createSpinnerOverlay(size, angle = 0) {
  const spinnerSize = Math.floor(size * 0.5);
  const svgSpinner = `
    <svg width="${spinnerSize}" height="${spinnerSize}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g transform="rotate(${angle} 12 12)">
        <path d="M12 2 L12 6 M12 18 L12 22 M4.93 4.93 L7.76 7.76 M16.24 16.24 L19.07 19.07 M2 12 L6 12 M18 12 L22 12 M4.93 19.07 L7.76 16.24 M16.24 7.76 L19.07 4.93" 
              stroke="#666" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.3"/>
        <path d="M12 2 L12 6" stroke="#000" stroke-width="2" stroke-linecap="round" fill="none"/>
      </g>
    </svg>
  `;
  
  return Buffer.from(svgSpinner);
}

async function generateIconWithOverlay(baseBuffer, overlayBuffer, size, namePrefix, isTemplate = false) {
  const scales = [1, 2, 3, 4];
  
  for (const scale of scales) {
    const scaledSize = size * scale;
    const overlaySize = Math.floor(scaledSize * 0.4);
    const overlayPos = scaledSize - overlaySize;
    const suffix = scale === 1 ? '' : `@${scale}x`;
    const filename = `${namePrefix}${suffix}.png`;
    
    console.log(`  Generando ${filename} (${scaledSize}x${scaledSize})...`);
    
    // Redimensionar overlay
    const resizedOverlay = await sharp(overlayBuffer)
      .resize(overlaySize, overlaySize)
      .png()
      .toBuffer();
    
    let pipeline = sharp(baseBuffer)
      .resize(scaledSize, scaledSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .composite([{
        input: resizedOverlay,
        top: overlayPos,
        left: overlayPos,
        blend: 'over'
      }]);
    
    if (isTemplate) {
      pipeline = pipeline.grayscale();
    }
    
    await pipeline.png().toFile(path.join(OUTPUT_DIR, filename));
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando generación de iconos de bandeja...');
    console.log(`📁 Archivo de entrada: ${INPUT_FILE}`);
    console.log(`📁 Directorio de salida: ${OUTPUT_DIR}\n`);
    
    // Verificar que el archivo de entrada existe
    try {
      await fs.access(INPUT_FILE);
    } catch (err) {
      console.error(`❌ Error: No se encontró el archivo ${INPUT_FILE}`);
      process.exit(1);
    }
    
    await ensureDir(OUTPUT_DIR);
    
    // Cargar imagen base
    const baseBuffer = await fs.readFile(INPUT_FILE);
    
    // 1. Iconos base (para Windows/Linux)
    console.log('\n📦 Generando iconos base...');
    await generateTrayIcon(baseBuffer, BASE_SIZE, 'trayIcon', false);
    
    // 2. Iconos template (para macOS)
    console.log('\n🍎 Generando iconos template para macOS...');
    await generateTrayIcon(baseBuffer, BASE_SIZE, 'trayIconTemplate', true);
    
    // 3. Iconos con notificación
    console.log('\n🔔 Generando iconos con notificación...');
    const notificationBadge = await createNotificationBadge(BASE_SIZE);
    await generateIconWithOverlay(baseBuffer, notificationBadge, BASE_SIZE, 'trayIconUpdateAvailable', false);
    await generateIconWithOverlay(baseBuffer, notificationBadge, BASE_SIZE, 'trayIconUpdateAvailableTemplate', true);
    
    // 4. Iconos con spinner
    console.log('\n⏳ Generando iconos con spinner...');
    const spinner = await createSpinnerOverlay(BASE_SIZE);
    await generateIconWithOverlay(baseBuffer, spinner, BASE_SIZE, 'trayIconCheckingForUpdates', false);
    await generateIconWithOverlay(baseBuffer, spinner, BASE_SIZE, 'trayIconCheckingForUpdatesTemplate', true);
    
    console.log('\n✨ ¡Todos los iconos de bandeja generados exitosamente!');
    console.log(`📁 Los iconos están en: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
    process.exit(1);
  }
}

main();
