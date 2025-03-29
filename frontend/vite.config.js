import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server:{port:5173,
    allowedHosts: ['9d72-2607-fea8-1dc0-3b30-8810-58bd-d38e-459b.ngrok-free.app']
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
