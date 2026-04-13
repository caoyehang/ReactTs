import { lazy } from "react";
import member from "./member";
export default [
  {
    path: "/home",
    element: lazy(() => import("@/pages/home/index")),
    meta: { title: "首页" },
  },
  ...member,
];
