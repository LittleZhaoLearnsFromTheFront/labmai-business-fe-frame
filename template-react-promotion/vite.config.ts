import react from '@vitejs/plugin-react-swc';
import { join, resolve } from 'path';
import { readFileSync } from 'fs'
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vitePluginAttrToWindow from 'vite-plugin-attr-to-window'

const evnConetnt = JSON.parse(readFileSync(resolve(process.cwd(), './config.json')).toString("utf-8"))

const basePath = evnConetnt["BASEPATH"] + '/' + evnConetnt["MIDDLE"] + '/' + evnConetnt["VITE_PROMOTION_VERSION"]

export default defineConfig(({ }) => ({

  base: basePath,
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  plugins: [react(), splitVendorChunkPlugin(), vitePluginAttrToWindow({
    baseRoute: basePath,
    cloudBeanRoute: evnConetnt['BASEPATH'] + '/'
  })],
  build: {
    outDir: `dist/${process.env.VERSION_NAME}-${process.env.NODE_NAME}`,
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://genee.testenv.labmai.com/abc',
        changeOrigin: true,
      },
    },
  },
}));
