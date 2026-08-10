import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,

    proxy: {
      '/api': {
        target: 'http://backend:9000',
        changeOrigin: true,
        secure: false,
      },

      '/auth/google': {
        target: 'http://backend:9000',
        changeOrigin: true,
        secure: false,
      },

      '/auth/github': {
        target: 'http://backend:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      tinymce: path.resolve(__dirname, 'node_modules/tinymce'),
    },
  },
  optimizeDeps: {
    include: [
      'tinymce/tinymce',
      'tinymce/icons/default',
      'tinymce/themes/silver',
      'tinymce/models/dom',
      'tinymce/plugins/advlist',
      'tinymce/plugins/autolink',
      'tinymce/plugins/lists',
      'tinymce/plugins/link',
      'tinymce/plugins/image',
      'tinymce/plugins/charmap',
      'tinymce/plugins/preview',
      'tinymce/plugins/anchor',
      'tinymce/plugins/searchreplace',
      'tinymce/plugins/visualblocks',
      'tinymce/plugins/code',
      'tinymce/plugins/fullscreen',
      'tinymce/plugins/insertdatetime',
      'tinymce/plugins/media',
      'tinymce/plugins/table',
      'tinymce/plugins/help',
      'tinymce/plugins/wordcount',
    ],
  },
});
