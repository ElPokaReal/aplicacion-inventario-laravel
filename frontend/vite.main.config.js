import { defineConfig } from 'vite';

// Configuración de Vite para el proceso principal de Electron
export default defineConfig({
  build: {
    outDir: '.vite/build',
    lib: {
      entry: 'electron/main.js',
      formats: ['cjs'],
      fileName: () => 'main.js'
    },
    rollupOptions: {
      external: ['electron']
    },
    emptyOutDir: true
  }
});
