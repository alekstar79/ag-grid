import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }): UserConfig => {
  const isPages = mode === 'pages'

  return {
    base: isPages ? '/ag-grid/' : '/',
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        scss: { api: 'modern' }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000
    }
  }
})
