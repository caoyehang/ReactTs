import { lazy } from "react";
import modules from "./modules/index";

/** 静态路由树（按模块拆分后汇总）；动态路由接入时在合并进树后再 `createBrowserRouter` */
const staticRouteConfig: IRouterType.IRouter[] = [
  {
    id: "layout",
    path: "/",
    element: lazy(() => import("@/Layout/index")),
    meta: { title: "layout" },
    children: [...modules],
  },
  {
    id: "login",
    path: "/login",
    element: lazy(() => import("@/pages/login/index")),
    meta: { title: "登录" },
  },
  {
    id: "not-found",
    path: "*",
    element: lazy(() => import("@/pages/notFound/index")),
    meta: { title: "404" },
  },
];

export default staticRouteConfig;
