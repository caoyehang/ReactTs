// 引入翻译函数和翻译 Hook，用于同步页面标题。
import { t, useAppTranslation } from "@/locales";
// 引入 antd 内容布局组件。
import { Layout } from "antd";
// 引入副作用 Hook，用于在路由变化后更新 document.title。
import { useEffect } from "react";
// 引入路由出口与当前匹配路由 Hook。
import { Outlet, useMatches } from "react-router-dom";

// 从 antd Layout 中取出 Content 组件。
const { Content } = Layout;

// 定义应用内容区组件。
const AppContent = () => {
  // 读取当前匹配到的路由链。
  const matches = useMatches();
  // 读取 i18n 状态，用于语言变化时刷新标题。
  const { i18n } = useAppTranslation();

  // 在路由或语言变化时同步浏览器标题。
  useEffect(() => {
    // 从后往前查找最具体且携带 meta 的路由。
    const currentMatch = [...matches]
      .reverse()
      .find((match) => (match.handle as IRouterType.IHandle | undefined)?.meta);

    // 读取当前路由的 meta 信息。
    const meta = (currentMatch?.handle as IRouterType.IHandle | undefined)
      ?.meta;

    // 没有标题时不更新浏览器标题。
    if (!meta?.title) {
      return;
    }

    // 根据当前语言翻译路由标题并写入 document.title。
    document.title = t(meta.title);
  }, [i18n.resolvedLanguage, matches]);

  // 渲染当前子路由页面。
  return (
    <Content>
      {/* React Router 会在这里渲染匹配到的子页面。 */}
      <Outlet />
    </Content>
  );
};

// 默认导出内容区组件。
export default AppContent;
