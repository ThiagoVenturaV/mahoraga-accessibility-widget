import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Mahoraga',
      fileName: (format) => `mahoraga-widget.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        exports: 'named',
        assetFileNames: 'mahoraga-widget.[ext]'
      }
    }
  }
});
