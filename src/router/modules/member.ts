// 引入会员菜单图标。
import { MailOutlined } from "@ant-design/icons";
// 引入 createElement，用于在纯配置里创建图标元素。
import { createElement } from "react";

// 定义会员模块路由。
const routes: IRouterType.IRouter[] = [
  // 定义会员一级菜单路由。
  {
    // 会员模块路由标识。
    id: "member",
    // 会员模块访问路径。
    path: "/member",
    // 会员模块名称。
    name: "member",
    // 会员模块元信息。
    meta: {
      title: "router.member.member",
      icon: createElement(MailOutlined),
    },
    // 定义会员模块子路由。
    children: [
      // 定义会员分组页面路由。
      {
        id: "member-group",
        path: "group",
        name: "member-group",
        meta: {
          title: "router.member.memberGroup",
          keepAlive: true,
        },
        component: () => import("@/pages/member/group/index"),
      },
      // 定义会员信息页面路由。
      {
        id: "member-info",
        path: "info",
        name: "member-info",
        meta: {
          title: "router.member.memberInfo",
          keepAlive: true,
        },
        component: () => import("@/pages/member/info/index"),
      },
    ],
  },
];

// 默认导出会员模块路由。
export default routes;
