import { siderStyle } from "@/utils/layout";
import { MailOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";

const { Sider } = Layout;
const AppSider = () => {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log(e.key);
  };
  const items = [
    {
      key: "sub1",
      label: "Navigation One",
      icon: <MailOutlined />,
      children: [
        {
          key: "g1",
          label: "Item 1",
          type: "group",
          children: [
            { key: "1", label: "Option 1" },
            { key: "2", label: "Option 2" },
          ],
        },
      ],
    },
  ];
  return (
    <Sider style={siderStyle} width={240}>
      <Menu
        theme="dark"
        onClick={handleMenuClick}
        className="bg-transparent border-none"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default AppSider;
