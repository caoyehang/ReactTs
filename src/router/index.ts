// 从 React 中引入 Suspense、createElement 和 lazy，用于懒加载页面组件。
import { Suspense, createElement, lazy } from "react";
// 引入 React Router 的路由对象类型，便于约束最终路由结构。
import type { RouteObject } from "react-router-dom";
// 引入导航组件和浏览器路由创建函数。
import { Navigate, createBrowserRouter } from "react-router-dom";
// 引入模块化页面路由配置。
import moduleRoutes from "./modules";

// 定义路由懒加载期间的占位元素。
const routeLoading = createElement("div", { className: "loading-spinner" });

// 将页面组件导入函数转换成可直接挂到路由里的懒加载元素。
function renderLazyRoute(importer: IRouterType.RouteComponentImporter) {
  // 基于传入的导入函数生成 React 懒组件。
  const Component = lazy(importer);

  // 返回带有 Suspense 包裹的懒加载组件元素。
  return createElement(
    // 使用 Suspense 处理异步组件加载过程。
    Suspense,
    // 指定组件加载中的兜底内容。
    { fallback: routeLoading },
    // 创建实际要渲染的懒组件元素。
    createElement(Component),
  );
}

// 声明应用的基础路由配置。
const routes: IRouterType.IRouter[] = [
  // 定义应用主布局路由。
  {
    // 当前布局路由的唯一标识。
    id: "layout",
    // 当前布局路由的访问路径。
    path: "/",
    // 当前布局路由的元信息。
    meta: { title: "layout" },
    // 当前布局路由对应的页面组件导入函数。
    component: () => import("@/Layout/index"),
    // 定义布局下挂载的子路由。
    children: [
      // 定义进入根路径后的默认重定向路由。
      {
        // 标记当前子路由为 index 路由。
        index: true,
        // 将根路径重定向到首页路径。
        element: createElement(Navigate, { to: "/home", replace: true }),
      },
      // 定义首页常规路由。
      {
        // 首页路由的唯一标识。
        id: "home",
        // 首页路由的路径。
        path: "/home",
        // 首页路由的元信息。
        meta: { title: "首页" },
        // 首页路由对应的页面组件导入函数。
        component: () => import("@/pages/home/index"),
      },
      // 展开所有模块化业务路由。
      ...moduleRoutes,
    ],
  },
  // 定义登录页常规路由。
  {
    // 登录页路由的唯一标识。
    id: "login",
    // 登录页路由的访问路径。
    path: "/login",
    // 登录页路由的元信息。
    meta: { title: "登录" },
    // 登录页对应的页面组件导入函数。
    component: () => import("@/pages/login/index"),
  },
  // 定义 404 页面路由。
  {
    // 404 路由的唯一标识。
    id: "not-found",
    // 404 路由的匹配路径。
    path: "*",
    // 404 路由的元信息。
    meta: { title: "404" },
    // 404 路由对应的页面组件导入函数。
    component: () => import("@/pages/notFound/index"),
  },
];

// 将自定义路由配置转换为 React Router 可识别的 RouteObject。
function toRouteObject(route: IRouterType.IRouter): RouteObject {
  // 从自定义路由对象中解构出后续要参与转换的字段。
  const { children, component, meta, name, handle, element, id, index, path } =
    route;
  // 优先使用已有 element，否则基于 component 生成懒加载元素。
  const resolvedElement =
    element ?? (component ? renderLazyRoute(component) : undefined);
  // 优先使用已有 handle，否则基于 meta 和 name 生成默认 handle。
  const resolvedHandle = handle ?? { meta, name };

  // 如果当前是索引路由，则返回索引路由结构。
  if (index) {
    // 返回索引路由对象。
    return {
      // 保留路由唯一标识。
      id,
      // 明确标记为 index 路由。
      index: true,
      // 挂载当前路由的渲染元素。
      element: resolvedElement,
      // 挂载当前路由的扩展信息。
      handle: resolvedHandle,
    };
  }

  // 返回普通路径路由对象。
  return {
    // 保留路由唯一标识。
    id,
    // 挂载普通路由的访问路径。
    path,
    // 挂载当前路由的渲染元素。
    element: resolvedElement,
    // 挂载当前路由的扩展信息。
    handle: resolvedHandle,
    // 递归转换当前路由的所有子路由。
    children: children?.length ? normalizeRoutes(children) : undefined,
  };
}

// 批量转换自定义路由数组。
function normalizeRoutes(routes: IRouterType.IRouter[]): RouteObject[] {
  // 逐个将自定义路由转换成标准 RouteObject。
  return routes.map(toRouteObject);
}

// 生成最终可供路由实例使用的标准路由数组。
export const appRoutes: RouteObject[] = normalizeRoutes(routes);
// 基于标准路由数组创建浏览器路由实例。
export const appRouter = createBrowserRouter(appRoutes);

// 默认导出应用路由实例。
export default appRouter;
