// 引入 React createElement，用于创建国际化 Provider。
import { createElement, type PropsWithChildren } from "react";
// 引入 i18next 实例与资源、选项类型。
import i18n, { type Resource, type TOptions } from "i18next";
// 引入浏览器语言探测插件。
import LanguageDetector from "i18next-browser-languagedetector";
// 引入 react-i18next 的 Provider、初始化插件和 Hook。
import {
  I18nextProvider,
  initReactI18next,
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

// 定义应用支持的语言常量。
export const I18N_LANGUAGE = {
  // 简体中文。
  ZH_CN: "zh-CN",
  // 美式英文。
  EN_US: "en-US",
} as const;

// 定义语言持久化本地存储键名。
export const I18N_STORAGE_KEY = "react-ts-language";

// 从语言常量中推导应用语言类型。
export type AppLanguage = (typeof I18N_LANGUAGE)[keyof typeof I18N_LANGUAGE];

// 按统一资源树组织中英文翻译资源。
const resources: Resource = {
  // 中文资源集合。
  [I18N_LANGUAGE.ZH_CN]: {
    translation: {
      common: zhCommon,
      layout: zhLayout,
      table: zhTable,
      router: {
        root: zhRootRoutes,
        member: zhMemberRoutes,
      },
    },
  },
  // 英文资源集合。
  [I18N_LANGUAGE.EN_US]: {
    translation: {
      common: enCommon,
      layout: enLayout,
      table: enTable,
      router: {
        root: enRootRoutes,
        member: enMemberRoutes,
      },
    },
  },
};

// 避免热更新或重复导入时重复初始化 i18n。
if (!i18n.isInitialized) {
  // 串联注册语言探测和 React 适配插件。
  i18n
    // 启用浏览器语言识别。
    .use(LanguageDetector)
    // 启用 React 适配能力。
    .use(initReactI18next)
    // 初始化 i18next 配置。
    .init({
      // 注入全部翻译资源。
      resources,
      // 未识别语言时回退到中文。
      fallbackLng: I18N_LANGUAGE.ZH_CN,
      // 声明支持的语言列表。
      supportedLngs: Object.values(I18N_LANGUAGE),
      // 使用默认 translation 命名空间。
      defaultNS: "translation",
      // 配置插值行为。
      interpolation: {
        // React 已经处理转义，这里关闭 i18next 转义。
        escapeValue: false,
      },
      // 配置语言探测来源。
      detection: {
        // 按 URL、本地存储、浏览器语言和 html 标签顺序探测。
        order: ["querystring", "localStorage", "navigator", "htmlTag"],
        // URL 中使用 lang 参数切换语言。
        lookupQuerystring: "lang",
        // 本地存储使用统一键名读取语言。
        lookupLocalStorage: I18N_STORAGE_KEY,
        // 探测结果写回本地存储。
        caches: ["localStorage"],
      },
    });
}

// 提供应用级 I18n Provider。
export const AppI18nProvider = ({ children }: PropsWithChildren) => {
  // 手动创建 Provider 并透传 children。
  return createElement(I18nextProvider, { i18n }, children);
};

// 封装业务使用的翻译 Hook。
export const useAppTranslation = () => useTranslation();

// 提供非 React 场景使用的翻译函数。
export const t = (key: string, options?: TOptions) =>
  // 默认值使用 key，避免缺失翻译时显示空内容。
  i18n.t(key, {
    defaultValue: key,
    ...options,
  });

// 暴露语言切换方法。
export const changeLanguage = (language: AppLanguage) => {
  // 委托 i18next 执行语言切换。
  return i18n.changeLanguage(language);
};

// 默认导出已初始化的 i18n 实例。
export default i18n;
