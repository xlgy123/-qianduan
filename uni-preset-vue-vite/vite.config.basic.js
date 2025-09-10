import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// 使用最基本的配置，避免Vue外部依赖问题
export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    cors: true,
  }
}) 