// 引入国际化切换常量、类型和业务翻译 Hook。
import {
  changeLanguage,
  I18N_LANGUAGE,
  type AppLanguage,
  useAppTranslation,
} from "@/locales";
// 引入顶部栏中使用的 antd 图标。
import {
  DownOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
// 引入业务封装后的 Redux hooks。
import { useAppDispatch, useAppSelector } from "@/store";
// 引入侧边栏折叠状态切换 action。
import { toggleSiderCollapsed } from "@/store/modules/auth";
// 引入布局样式常量，保持样式入口集中。
import { headerStyle } from "@/utils/layout";
// 引入 antd 顶部栏所需组件和菜单类型。
import { Avatar, Dropdown, Layout, type MenuProps } from "antd";
// 引入 React 键盘事件类型。
import type { KeyboardEvent } from "react";

// 从 antd Layout 中取出 Header 组件。
const { Header } = Layout;

// 定义用户菜单项，后续可以接入真实个人中心与退出登录逻辑。
const userMenuItems: MenuProps["items"] = [
  // 个人中心菜单项。
  {
    key: "profile",
    label: "个人中心",
  },
  // 退出登录菜单项。
  {
    key: "logout",
    label: "退出登录",
  },
];

// 定义应用顶部栏组件。
const AppHeader = () => {
  // 获取翻译函数和 i18n 实例。
  const { t, i18n } = useAppTranslation();
  // 获取带类型的 dispatch 函数。
  const dispatch = useAppDispatch();

  // 从 Redux 读取侧边栏折叠状态，保证 Header 和 Sider 同步。
  const siderCollapsed = useAppSelector((state) => state.auth.siderCollapsed);
  // 计算当前语言，优先使用 i18next 已解析语言。
  const currentLanguage = (i18n.resolvedLanguage ??
    i18n.language) as AppLanguage;

  // 定义语言切换菜单项。
  const languageMenuItems: MenuProps["items"] = [
    // 简体中文选项。
    {
      key: I18N_LANGUAGE.ZH_CN,
      label: "简体中文",
    },
    // 英文选项。
    {
      key: I18N_LANGUAGE.EN_US,
      label: "English",
    },
  ];

  // 统一处理侧边栏折叠切换。
  const handleToggleSider = () => {
    // 派发折叠状态切换 action。
    dispatch(toggleSiderCollapsed());
  };

  // 处理语言菜单点击事件。
  const handleLanguageChange: MenuProps["onClick"] = ({ key }) => {
    // 只接受应用声明支持的语言值。
    if (key === I18N_LANGUAGE.ZH_CN || key === I18N_LANGUAGE.EN_US) {
      // 切换语言并让 i18next 负责更新订阅组件。
      void changeLanguage(key as AppLanguage);
    }
  };

  // 复用键盘触发逻辑，保证类按钮元素可访问。
  const handleKeyboardClick = (event: KeyboardEvent<HTMLElement>) => {
    // Enter 和空格键都应触发点击行为。
    if (event.key === "Enter" || event.key === " ") {
      // 阻止空格触发页面滚动。
      event.preventDefault();
      // 调用当前元素的点击事件。
      event.currentTarget.click();
    }
  };

  // 渲染应用顶部栏。
  return (
    <Header
      // 使用集中定义的 Header 样式。
      style={headerStyle}
      // 使用 Tailwind 类补充布局和边框。
      className="flex items-center gap-3 border-b border-slate-200"
    >
      {/* 使用图标区域触发侧边栏折叠。 */}
      <span
        role="button"
        tabIndex={0}
        aria-label={t("layout.toggleSider")}
        onClick={handleToggleSider}
        onKeyDown={handleKeyboardClick}
        className="inline-flex cursor-pointer items-center justify-center p-1 text-lg text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"
      >
        {/* 根据当前折叠状态切换展示图标。 */}
        {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>

      {/* 右侧操作区域靠右排列。 */}
      <div className="ml-auto flex items-center gap-4">
        {/* 语言切换下拉菜单。 */}
        <Dropdown
          trigger={["click"]}
          menu={{
            items: languageMenuItems,
            onClick: handleLanguageChange,
            selectedKeys: [currentLanguage],
          }}
        >
          {/* 语言切换触发器。 */}
          <span
            role="button"
            tabIndex={0}
            aria-label={t("layout.switchLanguage")}
            onKeyDown={handleKeyboardClick}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 focus:outline-none"
          >
            {/* 语言切换图标。 */}
            <GlobalOutlined />
          </span>
        </Dropdown>

        {/* 用户操作下拉菜单。 */}
        <Dropdown trigger={["click"]} menu={{ items: userMenuItems }}>
          {/* 用户菜单触发器。 */}
          <span
            role="button"
            tabIndex={0}
            aria-label={t("layout.userMenu")}
            onKeyDown={handleKeyboardClick}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-1 py-1 text-slate-700 transition-colors hover:text-slate-900 focus:outline-none"
          >
            {/* 用户头像。 */}
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-slate-800"
            />
            {/* 当前用户名占位。 */}
            <span className="text-sm font-medium">Admin</span>
            {/* 下拉箭头图标。 */}
            <DownOutlined className="text-xs text-slate-500" />
          </span>
        </Dropdown>
      </div>
    </Header>
  );
};

// 默认导出顶部栏组件。
export default AppHeader;
