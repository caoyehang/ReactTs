// 引入应用级样式，当前主要包含路由加载动画。
import "./App.css";
// 引入 React Router 的 Provider，用于接管页面路由渲染。
import { RouterProvider } from "react-router-dom";
// 引入已经标准化后的浏览器路由实例。
import router from "@/router";

// 定义应用根组件，保持入口层只负责装配路由。
const App = () => {
  // 将路由实例交给 RouterProvider 渲染。
  return <RouterProvider router={router} />;
};

// 默认导出根组件，供 main.tsx 挂载。
export default App;
