import { MailOutlined } from "@ant-design/icons";
import { createElement } from "react";
import { t } from "@/locales";

const routes: IRouterType.IRouter[] = [
  {
    id: "member",
    path: "/member",
    name: "member",
    meta: {
      title: t("router.member.member"),
      icon: createElement(MailOutlined),
    },
    children: [
      {
        id: "member-group",
        path: "group",
        name: `member-group`,
        meta: {
          title: t("router.member.memberGroup"),
          keepAlive: true,
        },
        component: () => import("@/pages/member/group/index"),
      },
      {
        id: "member-info",
        path: "info",
        name: `member-info`,
        meta: {
          title: t("router.member.memberInfo"),
          keepAlive: true,
        },
        component: () => import("@/pages/member/info/index"),
      },
    ],
  },
];

export default routes;
