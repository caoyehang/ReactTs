import { createElement, type PropsWithChildren } from "react";
import i18n, { type Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";

import enCommon from "./lang/en-US/common.json";
import enLayout from "./lang/en-US/layout.json";
import enTable from "./lang/en-US/table.json";
import enMemberRoutes from "./lang/en-US/routes/member.json";
import enRootRoutes from "./lang/en-US/routes/root.json";
import zhCommon from "./lang/zh-CN/common.json";
import zhLayout from "./lang/zh-CN/layout.json";
import zhTable from "./lang/zh-CN/table.json";
import zhMemberRoutes from "./lang/zh-CN/routes/member.json";
import zhRootRoutes from "./lang/zh-CN/routes/root.json";

export const I18N_LANGUAGE = {
  ZH_CN: "zh-CN",
  EN_US: "en-US",
} as const;

export const I18N_NAMESPACE = {
  COMMON: "common",
  LAYOUT: "layout",
  TABLE: "table",
  ROUTES_ROOT: "routes/root",
  ROUTES_MEMBER: "routes/member",
} as const;

export const I18N_STORAGE_KEY = "react-ts-language";

export type AppLanguage = (typeof I18N_LANGUAGE)[keyof typeof I18N_LANGUAGE];
export type AppNamespace = (typeof I18N_NAMESPACE)[keyof typeof I18N_NAMESPACE];

export const appNamespaces = Object.values(I18N_NAMESPACE);

const resources: Resource = {
  [I18N_LANGUAGE.ZH_CN]: {
    [I18N_NAMESPACE.COMMON]: zhCommon,
    [I18N_NAMESPACE.LAYOUT]: zhLayout,
    [I18N_NAMESPACE.TABLE]: zhTable,
    [I18N_NAMESPACE.ROUTES_ROOT]: zhRootRoutes,
    [I18N_NAMESPACE.ROUTES_MEMBER]: zhMemberRoutes,
  },
  [I18N_LANGUAGE.EN_US]: {
    [I18N_NAMESPACE.COMMON]: enCommon,
    [I18N_NAMESPACE.LAYOUT]: enLayout,
    [I18N_NAMESPACE.TABLE]: enTable,
    [I18N_NAMESPACE.ROUTES_ROOT]: enRootRoutes,
    [I18N_NAMESPACE.ROUTES_MEMBER]: enMemberRoutes,
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: I18N_LANGUAGE.ZH_CN,
      supportedLngs: Object.values(I18N_LANGUAGE),
      ns: appNamespaces,
      defaultNS: I18N_NAMESPACE.COMMON,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "localStorage", "navigator", "htmlTag"],
        lookupQuerystring: "lang",
        lookupLocalStorage: I18N_STORAGE_KEY,
        caches: ["localStorage"],
      },
    });
}

export const AppI18nProvider = ({ children }: PropsWithChildren) => {
  return createElement(I18nextProvider, { i18n }, children);
};

export const useAppTranslation = (
  namespace?: AppNamespace | AppNamespace[],
) => {
  return useTranslation(namespace ?? I18N_NAMESPACE.COMMON);
};

export const tRoute = (title: string, namespace?: AppNamespace) => {
  return i18n.t(title, {
    ns: namespace ?? I18N_NAMESPACE.ROUTES_ROOT,
    defaultValue: title,
  });
};

export const changeLanguage = (language: AppLanguage) => {
  return i18n.changeLanguage(language);
};

export default i18n;
