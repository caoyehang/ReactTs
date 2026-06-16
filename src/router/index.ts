// 从 React 引入懒加载、元素创建和 Suspense 能力。
import { Suspense, createElement, lazy } from "react";
// 从 React Router 引入重定向组件和浏览器路由创建函数。
import { Navigate, createBrowserRouter } from "react-router-dom";
// 引入业务模块路由，主路由只负责聚合。
import moduleRoutes from "./modules";

// 定义页面懒加载期间的占位元素。
const routeLoading = createElement("div", { className: "loading-spinner" });

// 把页面导入函数转换成 React Router 可以渲染的懒加载元素。
const renderLazyRoute = (importer: IRouterType.RouteComponentImporter) => {
  // 基于传入的动态 import 创建懒加载组件。
  const Component = lazy(importer);

  // 返回带 Suspense 兜底内容的路由元素。
  return createElement(
    // 使用 Suspense 接管异步组件加载状态。
    Suspense,
    // 指定组件加载过程中的兜底内容。
    { fallback: routeLoading },
    // 创建实际要渲染的懒加载组件元素。
    createElement(Component),
  );
};

// 声明应用的基础路由配置。
const routes: IRouterType.IRouter[] = [
  // 定义应用主布局路由。
  {
    // 为布局路由提供稳定标识。
    id: "layout",
    // 指定布局路由的访问路径。
    path: "/",
    // 提供布局路由的元信息。
    meta: {
      title: "router.root.layout",
    },
    // 懒加载主布局组件，减少首屏同步代码体积。
    component: () => import("@/layouts/index"),
    // 定义布局下挂载的子路由。
    children: [
      // 定义进入根路径后的默认重定向路由。
      {
        // 标记当前子路由为 index 路由。
        index: true,
        // 将根路径重定向到首页。
        element: createElement(Navigate, { to: "/home", replace: true }),
      },
      // 定义首页常规路由。
      {
        // 提供首页路由标识。
        id: "home",
        // 提供首页访问路径。
        path: "/home",
        // 提供首页路由元信息。
        meta: {
          title: "router.root.home",
        },
        // 懒加载首页页面组件。
        component: () => import("@/pages/home/index"),
      },
      // 展开所有业务模块路由。
      ...moduleRoutes,
    ],
  },
  // 定义登录页路由。
  {
    // 提供登录路由标识。
    id: "login",
    // 提供登录页访问路径。
    path: "/login",
    // 提供登录页元信息。
    meta: {
      title: "router.root.login",
    },
    // 懒加载登录页组件。
    component: () => import("@/pages/login/index"),
  },
  // 定义 404 兜底路由。
  {
    // 提供 404 路由标识。
    id: "not-found",
    // 匹配所有未命中的路径。
    path: "*",
    // 提供 404 页面元信息。
    meta: {
      title: "router.root.notFound",
    },
    // 懒加载 404 页面组件。
    component: () => import("@/pages/notFound/index"),
  },
];

// 将自定义路由配置转换成 React Router 可识别的 RouteObject。
const toRouteObject = (
  route: IRouterType.IRouter,
): IRouterType.AppRouteObject => {
  // 解构当前路由中参与转换的字段。
  const { children, component, meta, name, handle, element, id, index, path } =
    route;
  // 优先使用已提供的元素，否则根据 component 生成懒加载元素。
  const resolvedElement =
    element ?? (component ? renderLazyRoute(component) : undefined);
  // 优先使用自定义 handle，否则把 meta 和 name 收进默认 handle。
  const resolvedHandle = handle ?? { meta, name };

  // 如果当前是 index 路由，则返回 index 路由结构。
  if (index) {
    // 返回 React Router 需要的 index 路由对象。
    return {
      // 保留路由唯一标识。
      id,
      // 标记这是 index 路由。
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
};

// 批量转换自定义路由数组。
const normalizeRoutes = (
  routes: IRouterType.IRouter[],
): IRouterType.AppRouteObject[] => {
  // 逐个把自定义路由转换为标准 RouteObject。
  return routes.map(toRouteObject);
};

// 生成最终供路由实例使用的标准路由数组。
export const appRoutes: IRouterType.AppRouteObject[] = normalizeRoutes(routes);
// 基于标准路由数组创建浏览器路由实例。
export const appRouter = createBrowserRouter(appRoutes);

// 默认导出应用路由实例。
export default appRouter;
