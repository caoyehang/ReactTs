// 引入 antd 的 Layout 容器组件。
import { Layout } from "antd";
// 引入应用侧边栏组件。
import AppSider from "./components/AppSider";
// 引入应用顶部栏组件。
import AppHeader from "./components/AppHeader";
// 引入应用内容区组件。
import AppContent from "./components/AppContent";
// 引入应用底部栏组件。
import AppFooter from "./components/AppFooter";

// 定义应用主布局组件，承载登录后的页面框架。
const AppLayout = () => {
  // 渲染侧边栏、顶部栏、内容区和底部栏。
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 渲染可折叠侧边栏。 */}
      <AppSider />
      {/* 渲染右侧主内容布局。 */}
      <Layout>
        {/* 渲染顶部操作栏。 */}
        <AppHeader />
        {/* 渲染当前路由页面内容。 */}
        <AppContent />
        {/* 渲染底部版权区域。 */}
        <AppFooter />
      </Layout>
    </Layout>
  );
};

// 默认导出主布局组件，供路由懒加载使用。
export default AppLayout;
