// 从 React 中引入 createElement，用来手动创建 Provider 元素。
// 同时引入 PropsWithChildren 类型，声明组件会接收 children。
import { createElement, type PropsWithChildren } from "react";
// 引入 i18next 实例本身，以及 Resource 类型用于约束资源结构。
import i18n, { type Resource, type TOptions } from "i18next";
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

// 定义语言持久化到本地存储时使用的键名。
export const I18N_STORAGE_KEY = "react-ts-language";

// 从语言常量对象中推导出语言类型。
export type AppLanguage = (typeof I18N_LANGUAGE)[keyof typeof I18N_LANGUAGE];

// 按照单资源树结构组织中英文资源，业务统一使用完整 key 调用翻译。
const resources: Resource = {
  // 中文资源集合。
  [I18N_LANGUAGE.ZH_CN]: {
    translation: {
      // 通用文案。
      common: zhCommon,
      // 布局文案。
      layout: zhLayout,
      // 表格文案。
      table: zhTable,
      // 路由文案。
      router: {
        root: zhRootRoutes,
        member: zhMemberRoutes,
      },
    },
  },
  // 英文资源集合。
  [I18N_LANGUAGE.EN_US]: {
    translation: {
      // 通用文案。
      common: enCommon,
      // 布局文案。
      layout: enLayout,
      // 表格文案。
      table: enTable,
      // 路由文案。
      router: {
        root: enRootRoutes,
        member: enMemberRoutes,
      },
    },
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
      // 统一使用默认 translation 命名空间。
      defaultNS: "translation",
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

// 封装业务使用的翻译 Hook，统一通过完整 key 获取文案。
export const useAppTranslation = () => useTranslation();

// 提供非 React 场景下的翻译方法，统一使用完整 key。
export const t = (key: string, options?: TOptions) =>
  i18n.t(key, {
    defaultValue: key,
    ...options,
  });

// 对外暴露语言切换方法。
export const changeLanguage = (language: AppLanguage) => {
  // 切换当前 i18n 语言。
  return i18n.changeLanguage(language);
};

// 默认导出已初始化的 i18n 实例。
export default i18n;
