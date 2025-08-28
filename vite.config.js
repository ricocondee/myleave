import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components/ui/': path.resolve(__dirname, 'src/components'),
      '@context/ui/': path.resolve(__dirname, 'src/context'),
      '@services/ui/': path.resolve(__dirname, 'src/services'),
      '@pages/ui/': path.resolve(__dirname, 'src/pages'),
      '@assets/ui/': path.resolve(__dirname, 'src/assets'),
    },
  },
});
