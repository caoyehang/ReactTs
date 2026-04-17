import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const { Content } = Layout;
const AppContent = () => {
  return (
    <Content>
      <Outlet />
    </Content>
  );
};

export default AppContent;
