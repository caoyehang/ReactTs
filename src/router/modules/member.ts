import { MailOutlined } from "@ant-design/icons";
import { createElement } from "react";

const routes: IRouterType.IRouter[] = [
  {
    id: "member",
    path: "/member",
    name: "member",
    meta: {
      title: "router.member.member",
      icon: createElement(MailOutlined),
    },
    children: [
      {
        id: "member-group",
        path: "group",
        name: `member-group`,
        meta: {
          title: "router.member.memberGroup",
          keepAlive: true,
        },
        component: () => import("@/pages/member/group/index"),
      },
      {
        id: "member-info",
        path: "info",
        name: `member-info`,
        meta: {
          title: "router.member.memberInfo",
          keepAlive: true,
        },
        component: () => import("@/pages/member/info/index"),
      },
    ],
  },
];

export default routes;
