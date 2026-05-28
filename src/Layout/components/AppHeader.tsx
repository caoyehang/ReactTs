import {
  changeLanguage,
  I18N_LANGUAGE,
  type AppLanguage,
  useAppTranslation,
} from "@/locales";
import {
  DownOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSiderCollapsed } from "@/store/modules/auth";
import { headerStyle } from "@/utils/layout";
import { Avatar, Dropdown, Layout, type MenuProps } from "antd";

const { Header } = Layout;

const userMenuItems: MenuProps["items"] = [
  {
    key: "profile",
    label: "个人中心",
  },
  {
    key: "logout",
    label: "退出登录",
  },
];

const AppHeader = () => {
  const { t, i18n } = useAppTranslation();
  const dispatch = useAppDispatch();

  // 从 Redux 读取折叠状态，保证图标与侧边栏展示保持一致。
  const siderCollapsed = useAppSelector((state) => state.auth.siderCollapsed);
  const currentLanguage = (i18n.resolvedLanguage ??
    i18n.language) as AppLanguage;

  const languageMenuItems: MenuProps["items"] = [
    {
      key: I18N_LANGUAGE.ZH_CN,
      label: "简体中文",
    },
    {
      key: I18N_LANGUAGE.EN_US,
      label: "English",
    },
  ];

  // 统一处理图标的点击与键盘触发，避免额外引入明显的按钮样式。
  const handleToggleSider = () => {
    dispatch(toggleSiderCollapsed());
  };

  const handleLanguageChange: MenuProps["onClick"] = ({ key }) => {
    if (key === I18N_LANGUAGE.ZH_CN || key === I18N_LANGUAGE.EN_US) {
      void changeLanguage(key as AppLanguage);
    }
  };

  return (
    <Header
      style={headerStyle}
      className="flex items-center gap-3 border-b border-slate-200 "
    >
      {/* 用轻量图标区域触发侧边栏折叠，减少按钮感。 */}
      <span
        role="button"
        onClick={handleToggleSider}
        className="inline-flex cursor-pointer items-center justify-center p-1 text-lg text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"
      >
        {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>

      <div className="ml-auto flex items-center gap-4">
        <Dropdown
          trigger={["click"]}
          menu={{
            items: languageMenuItems,
            onClick: handleLanguageChange,
            selectedKeys: [currentLanguage],
          }}
        >
          <span
            role="button"
            tabIndex={0}
            aria-label={t("layout.switchLanguage")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 focus:outline-none"
          >
            <GlobalOutlined />
          </span>
        </Dropdown>

        <Dropdown trigger={["click"]} menu={{ items: userMenuItems }}>
          <span
            role="button"
            tabIndex={0}
            aria-label={t("layout.userMenu")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-1 py-1 text-slate-700 transition-colors hover:text-slate-900 focus:outline-none"
          >
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-slate-800"
            />
            <span className="text-sm font-medium">Admin</span>
            <DownOutlined className="text-xs text-slate-500" />
          </span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
