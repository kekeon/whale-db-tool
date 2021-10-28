import { defineConfig } from 'vite'

import reactRefresh from '@vitejs/plugin-react-refresh'
const prefix = `monaco-editor/esm/vs`
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/common/css/var.less";',
        javascriptEnabled: true,
      },
    },
  },
  base: './',
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: '/src/',
      },
      {
        find: /^_cp\//,
        replacement: '/src/components/',
      },
      {
        find: /^~/,
        replacement: '',
      },
    ],
  },
  server: {
    proxy: {
      // 选项写法
      '^/api/.*': {
        target: 'http://localhost:8090/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
