import { lazy } from "react";

const routes: IRouterType.IRouter[] = [
  {
    path: "/member",
    name: "member",
    meta: { title: "member", icon: "ant-design:team-outlined" },
    children: [
      {
        path: "group",
        name: `member-group`,
        meta: {
          title: "memberGroup",
          keepAlive: true,
        },
        element: lazy(() => import("@/pages/member/group/index")),
      },
      {
        path: "info",
        name: `member-info`,
        meta: {
          title: "memberInfo",
          keepAlive: true,
        },
        element: lazy(() => import("@/pages/member/info/index")),
      },
    ],
  },
];

export default routes;
