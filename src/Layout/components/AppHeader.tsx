import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSiderCollapsed } from "@/store/modules/auth";
import { headerStyle } from "@/utils/layout";
import { Layout } from "antd";

const { Header } = Layout;

const AppHeader = () => {
  const dispatch = useAppDispatch();

  // 从 Redux 读取折叠状态，保证图标与侧边栏展示保持一致。
  const siderCollapsed = useAppSelector((state) => state.auth.siderCollapsed);

  // 统一处理图标的点击与键盘触发，避免额外引入明显的按钮样式。
  const handleToggleSider = () => {
    dispatch(toggleSiderCollapsed());
  };

  return (
    <Header
      style={headerStyle}
      className="flex items-center gap-3 border-b border-slate-200 "
    >
      {/* 用轻量图标区域触发侧边栏折叠，减少按钮感。 */}
      <span
        role="button"
        tabIndex={0}
        aria-label={siderCollapsed ? "展开侧边栏" : "收缩侧边栏"}
        onClick={handleToggleSider}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggleSider();
          }
        }}
        className="inline-flex cursor-pointer items-center justify-center p-1 text-lg text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"
      >
        {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>
    </Header>
  );
};

export default AppHeader;
