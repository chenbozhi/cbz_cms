import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path";  //这个path用到了上面安装的@types/node
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //这里进行配置别名
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src') // @代替src  path.resolve(__dirname, './src')
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5100,
    host: '0.0.0.0',  // 为了设置局域网可以访问
    https: false,
    proxy: {
      '/api': { // 配置需要代理的路径 --> 这里的意思是代理http://localhost:80/api/后的所有路由
        target: 'http://localhost:8090', // 目标地址 --> 服务器地址
        changeOrigin: true, // 允许跨域
        ws: true,  // 允许websocket代理
        // 重写路径 --> 作用与vue配置pathRewrite作用相同
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
})
