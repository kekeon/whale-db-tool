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
  base: '/',
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
  build: {
    base: '/',
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks:
          // (id) => {
          //   if (id.includes('node_modules')) {
          //     const modules = id.toString().split('node_modules/')
          //     return modules[modules.length - 1].split('/')[0].toString()
          //   }
          // },
          {
            react: ['react'],
            antd: ['antd'],
            ahooks: ['ahooks'],
            '@ant-design/icons': ['@ant-design/icons'],
            '@ant-design/pro-form': ['@ant-design/pro-form'],
            recoil: ['recoil'],
            'ace-builds': ['ace-builds'],
            'react-dom': ['react-dom'],
            'react-window': ['react-window'],
          },
      },
    },
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
