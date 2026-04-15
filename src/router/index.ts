import { lazy } from "react";
import modules from "./modules/index";
const Router: IRouterType.IRouter[] = [
  {
    path: "/",
    element: lazy(() => import("@/Layout/index")),
    meta: { title: "layout" },
    children: [...modules],
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
