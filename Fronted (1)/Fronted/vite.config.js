import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Your frontend Vite port
    proxy: {
      // This will proxy all requests to /api to your backend server
      '/api': {
        target: 'http://localhost:4000',  // Your backend API URL
        changeOrigin: true,  // Ensures that the origin header is rewritten
        secure: false,       // If your backend is not using HTTPS, set this to false
        rewrite: (path) => path.replace(/^\/api/, ''),  // Removes /api from the start of the path
      },
    },
  },
});
