import { defineConfig } from 'vite'
import path from 'path';
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src/pages'), // 根据项目结构调整
    },
  },
  plugins: [
    uni(),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用gzip压缩
    brotliSize: false,
    // 减小chunk大小
    chunkSizeWarningLimit: 2000
  },
  optimizeDeps: {
    // 移除对vue的显式包含
  },
  // 启用资源预加载
  server: {
    port: 5173,
    // 设置为false，防止自动打开多个浏览器窗口
    open: false,
    // 只在需要时打开浏览器
    strictPort: true,
    // 设置最大连接数为1，限制并发连接
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173,
      overlay: false
    },
    watch: {
      usePolling: true
    },
    cors: true
  }
})
