import { tRoute, useAppTranslation } from "@/locales";
import { Layout } from "antd";
import { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
const { Content } = Layout;

const AppContent = () => {
  const matches = useMatches();
  const { i18n } = useAppTranslation();

  useEffect(() => {
    const currentMatch = [...matches]
      .reverse()
      .find((match) => (match.handle as IRouterType.IHandle | undefined)?.meta);

    const meta = (currentMatch?.handle as IRouterType.IHandle | undefined)?.meta;

    if (!meta?.title) {
      return;
    }

    document.title = tRoute(
      meta.title,
      meta.i18nNamespace as Parameters<typeof tRoute>[1],
    );
  }, [i18n.resolvedLanguage, matches]);

  return (
    <Content>
      <Outlet />
    </Content>
  );
};

export default AppContent;
