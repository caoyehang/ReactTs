import { Layout } from "antd";
import AppSider from "./components/AppSider";
import AppHeader from "./components/AppHeader";
import AppContent from "./components/AppContent";
import AppFooter from "./components/AppFooter";

const index = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSider />
      <Layout>
        <AppHeader />
        <AppContent />
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default index;
