import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 核心插件
    react(),
    // tailwindcss插件
    tailwindcss(), // ⭐ 关键
  ],
  // 本地服务配置
  server: {
    // 指定服务器应该监听哪个 IP 地址。
    host: "0.0.0.0",
    // 前端端口
    port: 5173,
    // 项目启动后自动打开浏览器，也可以指定打开某个浏览器
    open: true,
    // 为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为
    cors: true,
  },
  // 共享配置
  resolve: {
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
