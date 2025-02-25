import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server:{
    allowedHosts: ['6ae1-2607-fea8-1dc0-3b30-7518-29e0-6a69-5887.ngrok-free.app']
  },
  theme: {
    extend: {
      colors: {
        primary: '#DDA0DD',
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
    },
  },
  
})
