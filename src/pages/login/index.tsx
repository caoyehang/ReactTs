import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/modules/auth";
import { useAppDispatch } from "@/store";
import { syncToken } from "@/store/modules/auth";
import type { LoginFormValues } from "@/types";

const Index = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values: LoginFormValues) => {
    const { token } = await login(values);

    dispatch(syncToken(token));
    navigate("/home");
  };

  return (
    // 页面主容器：全屏高度、浅灰背景、水平居中；通过顶部内边距把登录框下移到视觉中心附近。
    <div className="min-h-screen bg-[#efefef] flex justify-center px-4 pt-60 pb-6">
      {/* 登录卡片宽度：移动端自适应，桌面端最大 460px。 */}
      <div className="w-full max-w-115">
        <Typography.Title
          level={1}
          // 覆盖 antd 默认标题样式：去掉顶部 margin、加大字号并居中。
          className="mt-0! mb-10! text-center! text-[40px]! leading-[1.1]! font-bold!"
        >
          BO Admin
        </Typography.Title>

        <Form<LoginFormValues>
          form={form}
          onFinish={handleFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
            // 用户名输入框与下一个表单项的间距。
            className="mb-4.5!"
          >
            <Input
              placeholder="Username"
              prefix={<UserOutlined className="text-[#555]!" />}
              // 输入框高度/圆角/字号统一。
              className="h-11.5! rounded-[10px]! text-[18px]!"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
            // 密码框与登录按钮的间距略大，形成主次分组。
            className="mb-6!"
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined className="text-[#555]!" />}
              // 与用户名输入框保持一致的尺寸和视觉风格。
              className="h-11.5! rounded-[10px]! text-[18px]!"
            />
          </Form.Item>

          <Form.Item className="mb-0!">
            <Button
              type="primary"
              htmlType="submit"
              block
              // 主按钮更高更大字，突出主要操作。
              className="h-12! rounded-[10px]! text-[22px]! font-medium!"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Index;
