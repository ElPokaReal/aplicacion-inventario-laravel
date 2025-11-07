#!/usr/bin/env node

/**
 * Script para crear un icon.ico válido usando png-to-ico
 */

import pngToIco from 'png-to-ico';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../public/icons');
const OUTPUT_FILE = path.join(__dirname, '../public/icon.ico');

async function createIco() {
  console.log('🔧 Creando icon.ico válido con png-to-ico...\n');
  
  try {
    // Usar múltiples tamaños para el ICO (NSIS requiere esto)
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const pngFiles = [];
    
    console.log('📁 Recopilando archivos PNG...');
    
    for (const size of sizes) {
      const pngPath = path.join(ICONS_DIR, `${size}x${size}.png`);
      try {
        await fs.access(pngPath);
        pngFiles.push(pngPath);
        console.log(`   ✓ ${size}x${size}.png`);
      } catch (err) {
        console.log(`   ⚠ ${size}x${size}.png no encontrado, omitiendo...`);
      }
    }
    
    if (pngFiles.length === 0) {
      throw new Error('No se encontraron archivos PNG en la carpeta icons/');
    }
    
    console.log(`\n🔄 Convirtiendo ${pngFiles.length} PNGs a ICO...`);
    
    // Convertir PNGs a ICO
    const icoBuffer = await pngToIco(pngFiles);
    
    // Guardar el archivo
    await fs.writeFile(OUTPUT_FILE, icoBuffer);
    
    console.log(`✅ icon.ico creado exitosamente`);
    console.log(`📁 Ubicación: ${OUTPUT_FILE}`);
    
    // Verificar el tamaño
    const stats = await fs.stat(OUTPUT_FILE);
    console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📦 Tamaños incluidos: ${pngFiles.length} iconos`);
    
    console.log('\n💡 Ahora puedes ejecutar: npm run electron:build:win');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ENOENT') {
      console.error('\n⚠️  No se encontró la carpeta icons/');
      console.error('   Ejecuta primero: npm run icons:generate');
    }
    
    process.exit(1);
  }
}

createIco();
