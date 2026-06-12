import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/o1-connect-dashboard/',
  plugins: [react()],
})
