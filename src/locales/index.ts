// 从 React 中引入 createElement，用来手动创建 Provider 元素。
// 同时引入 PropsWithChildren 类型，声明组件会接收 children。
import { createElement, type PropsWithChildren } from "react";
// 引入 i18next 实例本身，以及 Resource 类型用于约束资源结构。
import i18n, { type Resource } from "i18next";
// 引入浏览器语言探测插件，用于自动识别用户当前语言。
import LanguageDetector from "i18next-browser-languagedetector";
// 引入 React 与 i18next 的桥接能力。
import {
  // I18nextProvider 用于把 i18n 实例注入 React 组件树。
  I18nextProvider,
  // initReactI18next 用于把 i18next 初始化为 React 可用的插件。
  initReactI18next,
  // useTranslation 是业务中获取翻译函数的基础 Hook。
  useTranslation,
} from "react-i18next";

// 引入英文通用文案。
import enCommon from "./lang/en-US/common.json";
// 引入英文布局文案。
import enLayout from "./lang/en-US/layout.json";
// 引入英文表格文案。
import enTable from "./lang/en-US/table.json";
// 引入英文会员路由文案。
import enMemberRoutes from "./lang/en-US/routes/member.json";
// 引入英文根路由文案。
import enRootRoutes from "./lang/en-US/routes/root.json";
// 引入中文通用文案。
import zhCommon from "./lang/zh-CN/common.json";
// 引入中文布局文案。
import zhLayout from "./lang/zh-CN/layout.json";
// 引入中文表格文案。
import zhTable from "./lang/zh-CN/table.json";
// 引入中文会员路由文案。
import zhMemberRoutes from "./lang/zh-CN/routes/member.json";
// 引入中文根路由文案。
import zhRootRoutes from "./lang/zh-CN/routes/root.json";

// 定义应用支持的语言枚举值。
export const I18N_LANGUAGE = {
  // 简体中文。
  ZH_CN: "zh-CN",
  // 美式英文。
  EN_US: "en-US",
} as const;

// 定义应用内使用到的命名空间常量。
export const I18N_NAMESPACE = {
  // 通用文案命名空间。
  COMMON: "common",
  // 布局文案命名空间。
  LAYOUT: "layout",
  // 表格文案命名空间。
  TABLE: "table",
  // 根路由文案命名空间。
  ROUTES_ROOT: "routes/root",
  // 会员模块路由文案命名空间。
  ROUTES_MEMBER: "routes/member",
} as const;

// 定义语言持久化到本地存储时使用的键名。
export const I18N_STORAGE_KEY = "react-ts-language";

// 从语言常量对象中推导出语言类型。
export type AppLanguage = (typeof I18N_LANGUAGE)[keyof typeof I18N_LANGUAGE];
// 从命名空间常量对象中推导出命名空间类型。
export type AppNamespace = (typeof I18N_NAMESPACE)[keyof typeof I18N_NAMESPACE];

// 提取全部命名空间，供 i18next 初始化时注册。
export const appNamespaces = Object.values(I18N_NAMESPACE);

// 按照 i18next Resource 结构组织中英文资源。
const resources: Resource = {
  // 中文资源集合。
  [I18N_LANGUAGE.ZH_CN]: {
    // 中文通用文案。
    [I18N_NAMESPACE.COMMON]: zhCommon,
    // 中文布局文案。
    [I18N_NAMESPACE.LAYOUT]: zhLayout,
    // 中文表格文案。
    [I18N_NAMESPACE.TABLE]: zhTable,
    // 中文根路由文案。
    [I18N_NAMESPACE.ROUTES_ROOT]: zhRootRoutes,
    // 中文会员路由文案。
    [I18N_NAMESPACE.ROUTES_MEMBER]: zhMemberRoutes,
  },
  // 英文资源集合。
  [I18N_LANGUAGE.EN_US]: {
    // 英文通用文案。
    [I18N_NAMESPACE.COMMON]: enCommon,
    // 英文布局文案。
    [I18N_NAMESPACE.LAYOUT]: enLayout,
    // 英文表格文案。
    [I18N_NAMESPACE.TABLE]: enTable,
    // 英文根路由文案。
    [I18N_NAMESPACE.ROUTES_ROOT]: enRootRoutes,
    // 英文会员路由文案。
    [I18N_NAMESPACE.ROUTES_MEMBER]: enMemberRoutes,
  },
};

// 避免在热更新或重复导入时重复初始化 i18n。
if (!i18n.isInitialized) {
  // 注册语言探测插件。
  i18n
    // 先启用浏览器语言识别。
    .use(LanguageDetector)
    // 再启用 React 适配插件。
    .use(initReactI18next)
    // 初始化 i18next 配置。
    .init({
      // 注入全部翻译资源。
      resources,
      // 当识别不到语言时回退到中文。
      fallbackLng: I18N_LANGUAGE.ZH_CN,
      // 明确声明支持的语言列表。
      supportedLngs: Object.values(I18N_LANGUAGE),
      // 注册全部命名空间。
      ns: appNamespaces,
      // 默认使用 common 命名空间。
      defaultNS: I18N_NAMESPACE.COMMON,
      // 插值配置。
      interpolation: {
        // React 默认已处理转义，这里关闭 i18next 转义。
        escapeValue: false,
      },
      // 语言探测来源配置。
      detection: {
        // 按 URL 参数、本地存储、浏览器语言、html 标签的顺序探测。
        order: ["querystring", "localStorage", "navigator", "htmlTag"],
        // URL 中使用 lang 参数切换语言。
        lookupQuerystring: "lang",
        // 本地存储使用统一键名读取语言。
        lookupLocalStorage: I18N_STORAGE_KEY,
        // 探测结果写回本地存储，便于下次直接复用。
        caches: ["localStorage"],
      },
    });
}

// 提供应用级 I18n Provider，包裹根组件使用。
export const AppI18nProvider = ({ children }: PropsWithChildren) => {
  // 手动创建 I18nextProvider，并把 children 透传进去。
  return createElement(I18nextProvider, { i18n }, children);
};

// 封装业务使用的翻译 Hook，默认落到 common 命名空间。
export const useAppTranslation = (
  // 允许传入单个或多个命名空间。
  namespace?: AppNamespace | AppNamespace[],
) => {
  // 未传命名空间时默认使用 common。
  return useTranslation(namespace ?? I18N_NAMESPACE.COMMON);
};

// 用于翻译路由标题，默认读取根路由命名空间。
export const tRoute = (title: string, namespace?: AppNamespace) => {
  // 调用 i18n.t 执行实际翻译。
  return i18n.t(title, {
    // 可覆盖命名空间，否则默认使用 routes/root。
    ns: namespace ?? I18N_NAMESPACE.ROUTES_ROOT,
    // 当找不到翻译时直接显示原始标题。
    defaultValue: title,
  });
};

// 对外暴露语言切换方法。
export const changeLanguage = (language: AppLanguage) => {
  // 切换当前 i18n 语言。
  return i18n.changeLanguage(language);
};

// 默认导出已初始化的 i18n 实例。
export default i18n;
