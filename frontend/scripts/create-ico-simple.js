#!/usr/bin/env node

/**
 * Script ultra-simple: Copia el logo.png como base para el icono
 * y deja que electron-builder lo convierta automáticamente
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_PATH = path.join(__dirname, '../public/logo.png');
const OUTPUT_PATH = path.join(__dirname, '../public/icon.png');

async function createIcon() {
  console.log('🔧 Creando icon.png optimizado para electron-builder...\n');
  
  try {
    // Verificar que existe el logo
    await fs.access(LOGO_PATH);
    console.log('✓ Logo encontrado');
    
    // Crear un PNG de 512x512 optimizado
    await sharp(LOGO_PATH)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(OUTPUT_PATH);
    
    console.log('✅ icon.png creado (512x512)');
    
    const stats = await fs.stat(OUTPUT_PATH);
    console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    
    console.log('\n💡 Ahora electron-builder convertirá automáticamente icon.png a .ico');
    console.log('   Ejecuta: npm run electron:build:win');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createIcon();
