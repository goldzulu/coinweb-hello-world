/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  build: { target: 'esnext' },
  plugins: [react(), wasm()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    deps: {
      optimizer: {
        web: {
          include: ['@coinweb/wallet-lib'], // need this because of wasm
        },
      },
    },
  },
});
