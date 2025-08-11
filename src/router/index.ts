import { lazy } from "react";

const Router: IRouterType.IRouter[] = [
  {
    path: "/",
    element: lazy(() => import("@/pages/home/index")),
    meta: { title: "首页" },
  },
  {
    path: "/login",
    element: lazy(() => import("@/pages/login/index")),
    meta: { title: "登录" },
  },
  {
    path: "*",
    element: lazy(() => import("@/pages/notFound/index")),
    meta: { title: "404" },
  },
];

export default Router;
