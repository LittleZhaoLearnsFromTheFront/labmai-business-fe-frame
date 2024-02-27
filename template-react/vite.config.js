import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
    }
  },
  server: {
    port: 8080, // 开发环境启动的端口
  },
  plugins: [react()],
})
