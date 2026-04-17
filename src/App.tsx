import "./App.css";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router/index";

const App = () => {
  return (
    // 应用根路由入口：后续切换静态/动态路由实例时只需替换 appRouter 的创建逻辑。
    <RouterProvider router={appRouter} />
  );
};

export default App;
