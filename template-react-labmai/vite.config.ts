import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import labmaiModel from "@labmai.dev/labmai-model"
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000, // 开发环境启动的端口
  },
  plugins: [react(), labmaiModel()],
})
