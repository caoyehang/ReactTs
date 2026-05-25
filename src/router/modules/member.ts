import { I18N_NAMESPACE } from "@/locales";
import { MailOutlined } from "@ant-design/icons";
import { createElement } from "react";

const routes: IRouterType.IRouter[] = [
  {
    id: "member",
    path: "/member",
    name: "member",
    meta: {
      title: "member",
      i18nNamespace: I18N_NAMESPACE.ROUTES_MEMBER,
      icon: createElement(MailOutlined),
    },
    children: [
      {
        id: "member-group",
        path: "group",
        name: `member-group`,
        meta: {
          title: "memberGroup",
          i18nNamespace: I18N_NAMESPACE.ROUTES_MEMBER,
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
          i18nNamespace: I18N_NAMESPACE.ROUTES_MEMBER,
          keepAlive: true,
        },
        component: () => import("@/pages/member/info/index"),
      },
    ],
  },
];

export default routes;
