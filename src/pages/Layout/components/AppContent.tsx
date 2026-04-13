import { Layout } from "antd";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
const { Content } = Layout;
const AppContent = () => {
  return (
    <Content>
      <Suspense fallback={<div className="loading-spinner"></div>}>
        <Outlet />
      </Suspense>
    </Content>
  );
};

export default AppContent;
