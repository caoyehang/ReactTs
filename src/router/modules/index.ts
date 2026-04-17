import { lazy } from "react";
import member from "./member";
export default [
  {
    id: "home",
    path: "/home",
    element: lazy(() => import("@/pages/home/index")),
    meta: { title: "首页" },
  },
  ...member,
];
