import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.spec.ts'],
      rollupTypes: true
    })
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@extensions': resolve(__dirname, 'src/extensions'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'styles/[name][extname]'
      }
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2020'
  }
});
