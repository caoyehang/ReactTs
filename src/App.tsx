import "./App.css";
// Suspense 组件通常与 React.lazy() 配合使用，来懒加载（按需加载）组件。
// React.lazy() 可以让你将一个模块分割成一个懒加载的部分，只有在需要时才加载。
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import router from "./router/index";
const App = () => {
  // 由于路由组件是懒加载的，渲染页面可能会有延迟，使用Suspense 可优化交互
  // 包装器：接收路由对象，将其中的 element（懒加载组件）用 Suspense 包裹，确保异步加载时不白屏。
  const RouteEleMent = (route: IRouterType.IRouter): React.ReactNode => {
    if (!route.element) {
      return null;
    }
    return (
      <Suspense fallback={<div className="loading-spinner"></div>}>
        <route.element />
      </Suspense>
    );
  };
  // 通过每个路由对象渲染Route
  // 递归处理嵌套路由
  const RouteItem = (route: IRouterType.IRouter) => {
    return (
      <Route key={route.path} element={RouteEleMent(route)} path={route.path}>
        {RouteList(route.children ?? [])}
      </Route>
    );
  };
  // 根据配置的routeconfig 生成Route
  const RouteList = (list: IRouterType.IRouter[]) => {
    return list.map((item) => RouteItem(item));
  };
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>{RouteList(router)}</Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
