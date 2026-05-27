import { t, useAppTranslation } from "@/locales";
import { useAppSelector } from "@/store";
import moduleRoutes from "@/router/modules";
import { siderStyle } from "@/utils/layout";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const { Sider } = Layout;

// 将子路由的相对路径补全为可直接用于菜单跳转的绝对路径。
const normalizeMenuPath = (parentPath: string, currentPath?: string) => {
  if (!currentPath) {
    return parentPath;
  }

  if (currentPath.startsWith("/")) {
    return currentPath;
  }

  return `${parentPath.replace(/\/$/, "")}/${currentPath}`;
};

// 递归把路由树转换为 antd Menu 所需的 items 结构。
const createMenuItems = (
  routes: IRouterType.IRouter[],
  parentPath = "",
): Required<MenuProps>["items"] => {
  return routes
    .filter((route) => route.meta?.title && !route.index)
    .map((route) => {
      const fullPath = normalizeMenuPath(parentPath, route.path);
      const children = route.children?.length
        ? createMenuItems(route.children, fullPath)
        : undefined;
      return {
        key: fullPath || route.id || route.name || route.meta!.title,
        label: route.meta!.title,
        icon: route.meta?.icon,
        children: children?.length ? children : undefined,
      };
    });
};
const AppSider = () => {
  useAppTranslation();
  // 获取编程式导航函数，用于在点击菜单项后跳转到对应路由。
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 直接消费 Redux 中的折叠状态，确保与 Header 操作同步。
  const siderCollapsed = useAppSelector((state) => state.auth.siderCollapsed);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  // 缓存菜单项结果，避免组件每次渲染时都重新递归生成整棵菜单树。
  const items = useMemo(() => {
    const homeMenuItem = {
      key: "/home",
      label: t("router.root.home"),
      icon: <HomeOutlined />,
    };

    return [homeMenuItem, ...(createMenuItems(moduleRoutes) ?? [])];
  }, []);

  const selectedKeys = useMemo(() => [pathname], [pathname]);

  const openKeys = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) {
      return [];
    }

    return segments
      .slice(0, -1)
      .map((_, index) => `/${segments.slice(0, index + 1).join("/")}`);
  }, [pathname]);

  return (
    <Sider
      style={siderStyle}
      width={240}
      collapsed={siderCollapsed}
      trigger={null}
    >
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

export default AppSider;
