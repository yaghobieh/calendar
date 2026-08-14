import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@constants': resolve(__dirname, 'src/constants/index.ts'),
      '@utils': resolve(__dirname, 'src/utils/index.ts'),
      '@hooks': resolve(__dirname, 'src/hooks/index.ts'),
    },
  },
  plugins: [
    react(),
    dts({ insertTypesEntry: true }),
  ],
  build: {
    minify: 'esbuild',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  test: {
    environment: 'node',
  },
});
