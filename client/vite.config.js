import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API_PROXY_TARGET lets `npm run dev` inside Docker reach the `server` service.
const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api': apiTarget,
    },
  },
  preview: {
    port: 8080,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    css: false,
  },
});
