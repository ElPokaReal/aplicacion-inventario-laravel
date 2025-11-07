#!/usr/bin/env node

/**
 * Script alternativo usando ImageMagick (si está disponible)
 * Requiere tener instalado ImageMagick en el sistema
 * Descarga: https://imagemagick.org/script/download.php#windows
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../public/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function checkMagick() {
  try {
    await execAsync('magick --version');
    return true;
  } catch (err) {
    return false;
  }
}

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function generateWindowsIcon() {
  console.log('\n📦 Generando icon.ico para Windows...');
  
  const outputPath = path.join(OUTPUT_DIR, 'icon.ico');
  const cmd = `magick "${INPUT_FILE}" -background none -density 400 -define icon:auto-resize=256,128,96,64,48,32,24,16 "${outputPath}"`;
  
  console.log(`Ejecutando: ${cmd}`);
  const { stdout, stderr } = await execAsync(cmd);
  
  if (stderr) console.log(stderr);
  console.log('✅ icon.ico generado');
}

async function generateMacIcons() {
  console.log('\n🍎 Generando iconos para macOS...');
  
  const iconsetDir = path.join(OUTPUT_DIR, 'icon.iconset');
  await ensureDir(iconsetDir);
  
  const sizes = [16, 32, 64, 128, 256, 512];
  
  for (const size of sizes) {
    const border = Math.floor((size * 100) / 1000000);
    const actualSize = size - 2 * border;
    
    // Tamaño normal
    if (size !== 1024) {
      const output = path.join(iconsetDir, `icon_${size}x${size}.png`);
      const cmd = `magick "${INPUT_FILE}" -background none -density 400 -resize ${actualSize}x${actualSize} -bordercolor transparent -border ${border} "${output}"`;
      console.log(`  Generando icon_${size}x${size}.png...`);
      await execAsync(cmd);
    }
    
    // Tamaño @2x
    if (size !== 16) {
      const half = size / 2;
      const output = path.join(iconsetDir, `icon_${half}x${half}@2x.png`);
      const cmd = `magick "${INPUT_FILE}" -background none -density 400 -resize ${actualSize}x${actualSize} -bordercolor transparent -border ${border} "${output}"`;
      console.log(`  Generando icon_${half}x${half}@2x.png...`);
      await execAsync(cmd);
    }
  }
  
  console.log('✅ Iconos para macOS generados en icon.iconset/');
  
  // Intentar crear .icns si estamos en macOS
  try {
    const icnsPath = path.join(OUTPUT_DIR, 'icon.icns');
    await execAsync(`iconutil --convert icns -o "${icnsPath}" "${iconsetDir}"`);
    console.log('✅ icon.icns generado');
  } catch (err) {
    console.log('ℹ️  Para crear icon.icns en macOS, ejecuta:');
    console.log(`   iconutil --convert icns -o icon.icns icon.iconset`);
  }
}

async function generateLinuxIcons() {
  console.log('\n🐧 Generando iconos para Linux...');
  
  const iconsDir = path.join(OUTPUT_DIR, 'icons');
  await ensureDir(iconsDir);
  
  const sizes = [16, 22, 24, 32, 36, 48, 64, 72, 96, 128, 192, 256, 512];
  
  for (const size of sizes) {
    const border = Math.floor((size * 38) / 1000000);
    const actualSize = size - 2 * border;
    const output = path.join(iconsDir, `${size}x${size}.png`);
    
    const cmd = `magick "${INPUT_FILE}" -background none -density 400 -resize ${actualSize}x${actualSize} -bordercolor transparent -border ${border} "${output}"`;
    console.log(`  Generando ${size}x${size}.png...`);
    await execAsync(cmd);
  }
  
  console.log('✅ Iconos para Linux generados en icons/');
}

async function generateAppIcon() {
  console.log('\n🎨 Generando app-icon.ico...');
  
  const outputPath = path.join(OUTPUT_DIR, 'app-icon.ico');
  const cmd = `magick "${INPUT_FILE}" -background none -density 400 -define icon:auto-resize=256,128,96,64,48,32,24,16 "${outputPath}"`;
  
  await execAsync(cmd);
  console.log('✅ app-icon.ico generado');
}

async function main() {
  try {
    console.log('🚀 Iniciando generación de iconos con ImageMagick...');
    console.log(`📁 Archivo de entrada: ${INPUT_FILE}`);
    console.log(`📁 Directorio de salida: ${OUTPUT_DIR}\n`);
    
    // Verificar ImageMagick
    const hasMagick = await checkMagick();
    if (!hasMagick) {
      console.error('❌ Error: ImageMagick no está instalado o no está en el PATH');
      console.error('   Descarga: https://imagemagick.org/script/download.php#windows');
      console.error('   Alternativamente, usa: npm run generate-icons');
      process.exit(1);
    }
    
    console.log('✅ ImageMagick detectado\n');
    
    // Verificar archivo de entrada
    try {
      await fs.access(INPUT_FILE);
    } catch (err) {
      console.error(`❌ Error: No se encontró el archivo ${INPUT_FILE}`);
      process.exit(1);
    }
    
    await generateWindowsIcon();
    await generateMacIcons();
    await generateLinuxIcons();
    await generateAppIcon();
    
    console.log('\n✨ ¡Todos los iconos generados exitosamente!');
  } catch (error) {
    console.error('❌ Error generando iconos:', error.message);
    if (error.stderr) {
      console.error('Detalles:', error.stderr);
    }
    process.exit(1);
  }
}

main();
