// 引入 Vite 配置定义函数。
import { defineConfig } from "vite";
// 引入 React 插件以支持 JSX、Fast Refresh 等能力。
import react from "@vitejs/plugin-react";
// 引入 Tailwind CSS Vite 插件。
import tailwindcss from "@tailwindcss/vite";
// 引入 Node path 工具，用于生成绝对别名路径。
import path from "path";

// 导出 Vite 配置。
export default defineConfig({
  // 注册构建插件。
  plugins: [
    // 启用 React 插件。
    react(),
    // 启用 Tailwind CSS 插件。
    tailwindcss(),
  ],
  // 配置本地开发服务器。
  server: {
    // 允许局域网访问开发服务。
    host: "0.0.0.0",
    // 固定开发服务端口。
    port: 5173,
    // 启动后自动打开浏览器。
    open: true,
    // 允许跨域请求，方便本地联调。
    cors: true,
  },
  // 配置模块解析行为。
  resolve: {
    // 定义路径别名。
    alias: {
      // 使用 @ 指向 src 目录。
      "@": path.resolve(__dirname, "src"),
    },
  },
});
