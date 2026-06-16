// 引入非组件场景翻译函数和组件内翻译 Hook。
import { t, useAppTranslation } from "@/locales";
// 引入模块化路由，用于自动生成菜单。
import moduleRoutes from "@/router/modules";
// 引入带类型的 Redux selector。
import { useAppSelector } from "@/store";
// 引入侧边栏样式常量。
import { siderStyle } from "@/utils/layout";
// 引入首页菜单图标。
import { HomeOutlined } from "@ant-design/icons";
// 引入 antd 菜单类型。
import type { MenuProps } from "antd";
// 引入 antd 布局与菜单组件。
import { Layout, Menu } from "antd";
// 引入 useMemo，避免重复生成菜单树。
import { useMemo } from "react";
// 引入路由定位与编程式导航 Hook。
import { useLocation, useNavigate } from "react-router-dom";

// 从 antd Layout 中取出 Sider 组件。
const { Sider } = Layout;

// 把相对路径补全成菜单可直接跳转的绝对路径。
const normalizeMenuPath = (parentPath: string, currentPath?: string) => {
  // 没有当前路径时沿用父路径。
  if (!currentPath) {
    return parentPath;
  }

  // 已经是绝对路径时直接返回。
  if (currentPath.startsWith("/")) {
    return currentPath;
  }

  // 拼接父路径与当前相对路径。
  return `${parentPath.replace(/\/$/, "")}/${currentPath}`;
};

// 递归把路由树转换成 antd Menu 需要的 items 结构。
const createMenuItems = (
  routes: IRouterType.IRouter[],
  translate: typeof t,
  parentPath = "",
): Required<MenuProps>["items"] => {
  // 过滤掉没有标题或 index 类型的路由，再映射为菜单项。
  return routes
    .filter((route) => route.meta?.title && !route.index)
    .map((route) => {
      // 计算当前菜单项完整路径。
      const fullPath = normalizeMenuPath(parentPath, route.path);
      // 递归生成子菜单项。
      const children = route.children?.length
        ? createMenuItems(route.children, translate, fullPath)
        : undefined;
      // 返回 antd MenuItem 配置。
      return {
        key: fullPath || route.id || route.name || route.meta!.title,
        label: translate(route.meta!.title),
        icon: route.meta?.icon,
        children: children?.length ? children : undefined,
      };
    });
};

// 定义应用侧边栏组件。
const AppSider = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();
  // 获取编程式导航函数。
  const navigate = useNavigate();
  // 获取当前浏览器路径。
  const { pathname } = useLocation();

  // 从 Redux 读取折叠状态，和 Header 的控制保持一致。
  const siderCollapsed = useAppSelector((state) => state.auth.siderCollapsed);

  // 处理菜单点击并跳转到对应路由。
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // 使用菜单 key 作为目标路径。
    navigate(e.key);
  };

  // 缓存菜单结构，避免每次渲染都递归生成。
  const items = useMemo(() => {
    // 手动补充首页菜单项。
    const homeMenuItem = {
      key: "/home",
      label: t("router.root.home"),
      icon: <HomeOutlined />,
    };

    // 合并首页菜单与模块菜单。
    return [homeMenuItem, ...(createMenuItems(moduleRoutes, t) ?? [])];
  }, [t]);

  // 根据当前路径控制选中菜单项。
  const selectedKeys = useMemo(() => [pathname], [pathname]);

  // 根据当前路径计算需要展开的父级菜单。
  const openKeys = useMemo(() => {
    // 拆分路径片段。
    const segments = pathname.split("/").filter(Boolean);

    // 单层路径没有父级菜单需要展开。
    if (segments.length <= 1) {
      return [];
    }

    // 逐级拼出父路径，供 Menu 默认展开使用。
    return segments
      .slice(0, -1)
      .map((_, index) => `/${segments.slice(0, index + 1).join("/")}`);
  }, [pathname]);

  // 渲染侧边栏与菜单。
  return (
    <Sider
      // 使用集中定义的侧边栏样式。
      style={siderStyle}
      // 设定展开时的固定宽度。
      width={240}
      // 使用 Redux 中的折叠状态。
      collapsed={siderCollapsed}
    >
      {/* 渲染暗色内联菜单。 */}
      <Menu
        theme="dark"
        onClick={handleMenuClick}
        className="bg-transparent border-none"
        mode="inline"
        items={items}
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
      />
    </Sider>
  );
};

// 默认导出侧边栏组件。
export default AppSider;
