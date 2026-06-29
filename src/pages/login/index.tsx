// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";
// 引入登录表单所需图标。
import { LockOutlined, UserOutlined } from "@ant-design/icons";
// 引入 antd 表单、输入框、按钮和标题组件。
import { Button, Form, Input, Typography } from "antd";
// 引入编程式导航 Hook。
import { useNavigate } from "react-router-dom";
// 引入登录接口方法。
import { login } from "@/api/modules/auth";
// 引入带类型的 Redux dispatch Hook。
import { useAppDispatch } from "@/store";
// 引入同步 token 的 action。
import { syncToken } from "@/store/modules/auth";
// 引入登录表单字段类型。
import type { LoginFormValues } from "@/types";

// 定义登录页面组件。
const LoginPage = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();
  // 创建 antd 表单实例。
  const [form] = Form.useForm<LoginFormValues>();
  // 获取 Redux dispatch。
  const dispatch = useAppDispatch();
  // 获取编程式导航函数。
  const navigate = useNavigate();

  // 处理登录表单提交。
  const handleFinish = async (values: LoginFormValues) => {
    // 调用登录接口并读取 token。
    const { token } = await login({
      userName: values.username,
      password: values.password,
    });

    // 将 token 同步到 Redux。
    dispatch(syncToken(token));
    // 登录成功后跳转首页。
    navigate("/home");
  };

  // 渲染登录页面。
  return (
    // 页面主容器负责全屏背景和居中排版。
    <div className="min-h-screen bg-[#efefef] flex justify-center px-4 pt-60 pb-6">
      {/* 登录表单容器限制最大宽度。 */}
      <div className="w-full max-w-115">
        {/* 系统标题。 */}
        <Typography.Title
          level={1}
          className="mt-0! mb-10! text-center! text-[40px]! leading-[1.1]! font-bold!"
        >
          BO Admin
        </Typography.Title>

        {/* 登录表单。 */}
        <Form<LoginFormValues>
          form={form}
          onFinish={handleFinish}
          autoComplete="off"
          size="large"
        >
          {/* 用户名表单项。 */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: t("common.usernameRequired") }]}
            className="mb-4.5!"
          >
            {/* 用户名输入框。 */}
            <Input
              placeholder={t("common.username")}
              prefix={<UserOutlined className="text-[#555]!" />}
              className="h-11.5! rounded-[10px]! text-[18px]!"
            />
          </Form.Item>

          {/* 密码表单项。 */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: t("common.passwordRequired") }]}
            className="mb-6!"
          >
            {/* 密码输入框。 */}
            <Input.Password
              placeholder={t("common.password")}
              prefix={<LockOutlined className="text-[#555]!" />}
              className="h-11.5! rounded-[10px]! text-[18px]!"
            />
          </Form.Item>

          {/* 提交按钮表单项。 */}
          <Form.Item className="mb-0!">
            {/* 登录提交按钮。 */}
            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-12! rounded-[10px]! text-[22px]! font-medium!"
            >
              {t("router.root.login")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

// 默认导出登录页面。
export default LoginPage;
