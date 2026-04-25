const routes: IRouterType.IRouter[] = [
  {
    id: "member",
    path: "/member",
    name: "member",
    meta: { title: "member", icon: "ant-design:team-outlined" },
    children: [
      {
        id: "member-group",
        path: "group",
        name: `member-group`,
        meta: {
          title: "memberGroup",
          keepAlive: true,
        },
        component: () => import("@/pages/member/group/index"),
      },
      {
        id: "member-info",
        path: "info",
        name: `member-info`,
        meta: {
          title: "memberInfo",
          keepAlive: true,
        },
        component: () => import("@/pages/member/info/index"),
      },
    ],
  },
];

export default routes;
