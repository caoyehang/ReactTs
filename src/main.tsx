// 引入 React 的严格模式，用于在开发环境暴露潜在问题。
import { StrictMode } from "react";
// 引入 React 19 的根节点创建 API。
import { createRoot } from "react-dom/client";
// 引入 Redux Provider，把全局 store 注入组件树。
import { Provider } from "react-redux";
// 引入全局样式入口，集中加载 Tailwind 与基础样式。
import "./styles/index.css";
// 引入应用根组件，根组件负责挂载路由系统。
import App from "./app/App";
// 引入国际化 Provider，保证业务组件可以读取翻译能力。
import { AppI18nProvider } from "./locales";
// 引入 Redux store 实例，作为应用级状态容器。
import { store } from "./store";

// 获取 HTML 中的根节点并挂载 React 应用。
createRoot(document.getElementById("root")!).render(
  // 使用严格模式包裹整个应用。
  <StrictMode>
    {/* 为组件树提供 i18n 上下文。 */}
    <AppI18nProvider>
      {/* 为组件树提供 Redux 状态上下文。 */}
      <Provider store={store}>
        {/* 渲染应用根组件。 */}
        <App />
      </Provider>
    </AppI18nProvider>
  </StrictMode>,
);
