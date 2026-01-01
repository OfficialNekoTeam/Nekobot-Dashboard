import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    open: true,
    port: 3000,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1600
  },
  preview: {
    open: true,
    host: true
  },
  define: {
    global: 'window'
  },
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
    }
  },
  plugins: [react(), viteTsconfigPaths()]
});