import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // Development config
    return {
      root: resolve(__dirname, 'dev'),
      server: {
        port: 5173,
      },
      resolve: {
        alias: {
          '@sdk': resolve(__dirname, 'src'),
        },
      },
    };
  }
  // Build config
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Verified',
        fileName: (format) => `index.${format}.js`,
        formats: ['esm', 'umd'],
      },
      rollupOptions: {
        external: [], // Add external dependencies here if needed
        output: {
          globals: {}, // Add global variable names for external dependencies if needed
        },
      },
    },
    resolve: {
      alias: {
        '@sdk': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      dts({
        rollupTypes: true,
        outDir: 'dist',
        include: ['src'],
        exclude: ['dev', 'dist', '__tests__'],
      }),
    ],
  };
});
