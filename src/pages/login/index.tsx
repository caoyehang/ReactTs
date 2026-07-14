// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";
// 引入登录表单所需图标。
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
// 引入 antd 表单、输入框、按钮、消息提示和标题组件。
import { Button, Form, Input, message, Typography } from "antd";
// 引入 React 状态与生命周期 Hook。
import { useCallback, useEffect, useRef, useState } from "react";
// 引入编程式导航 Hook。
import { useNavigate } from "react-router-dom";
// 引入登录接口方法。
import { getCaptchaImage, login } from "@/api/modules/auth";
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
  // 获取 Redux dispatch。
  const dispatch = useAppDispatch();
  // 获取编程式导航函数。
  const navigate = useNavigate();
  // 保存图片验证码内容。
  const [captchaImage, setCaptchaImage] = useState("");
  // 控制验证码加载状态。
  const [captchaLoading, setCaptchaLoading] = useState(false);
  // 控制登录按钮加载状态。
  const [loginLoading, setLoginLoading] = useState(false);
  // 保存登录表单输入内容。
  const [userInfo, setUserInfo] = useState<LoginFormValues>({
    username: "",
    password: "",
    code: "",
    uuid: "",
  });
  // 记录初始化验证码是否已经请求过，避免开发严格模式下重复请求。
  const captchaInitializedRef = useRef(false);

  // 把后端返回的 base64 内容转换为浏览器可渲染的图片地址。
  const formatCaptchaImage = (img: string) => {
    return img.startsWith("data:") ? img : `data:image/png;base64,${img}`;
  };

  // 拉取并刷新图片验证码。
  const loadCaptchaImage = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const captcha = await getCaptchaImage();
      const captchaData = captcha.data ?? captcha;

      if (captchaData.captchaEnabled === false) {
        setCaptchaImage("");
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          uuid: "",
        }));
        return;
      }

      if (captchaData.img && captchaData.uuid) {
        setCaptchaImage(formatCaptchaImage(captchaData.img));
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          uuid: captchaData.uuid,
        }));
      }
    } catch {
      // 验证码接口不可用时保留手动刷新入口。
      setCaptchaImage("");
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        uuid: "",
      }));
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // 页面初始化时获取验证码。
  useEffect(() => {
    if (captchaInitializedRef.current) {
      return;
    }

    captchaInitializedRef.current = true;
    void loadCaptchaImage();
  }, [loadCaptchaImage]);

  // 手动刷新验证码时同步清空旧验证码输入。
  const handleRefreshCaptcha = () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      code: "",
      uuid: "",
    }));
    void loadCaptchaImage();
  };

  // 更新登录表单字段。
  const handleUserInfoChange = (field: keyof LoginFormValues, value: string) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [field]: value,
    }));
  };

  // 处理登录表单提交。
  const handleFinish = async () => {
    if (!userInfo.username) {
      void message.warning(t("common.usernameRequired"));
      return;
    }

    if (!userInfo.password) {
      void message.warning(t("common.passwordRequired"));
      return;
    }

    if (!userInfo.code) {
      void message.warning("请输入验证码");
      return;
    }

    setLoginLoading(true);
    try {
      // 调用登录接口并读取 token。
      const token = await login({
        username: userInfo.username,
        password: userInfo.password,
        code: userInfo.code,
        uuid: userInfo.uuid,
      });

      // 将 token 同步到 Redux。
      dispatch(syncToken(token));
      // 登录成功后跳转首页。
      navigate("/home");
    } catch {
      // 登录失败后刷新验证码，避免用户重复提交失效验证码。
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        code: "",
        uuid: "",
      }));
      void loadCaptchaImage();
    } finally {
      setLoginLoading(false);
    }
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
        <Form
          onFinish={handleFinish}
          autoComplete="off"
          size="large"
        >
          {/* 用户名表单项。 */}
          <Form.Item
            className="mb-4.5!"
          >
            {/* 用户名输入框。 */}
            <Input
              value={userInfo.username}
              onChange={(event) => handleUserInfoChange("username", event.target.value)}
              placeholder={t("common.username")}
              prefix={<UserOutlined className="text-[#555]!" />}
              className="h-11.5! rounded-[10px]! text-[18px]!"
            />
          </Form.Item>

          {/* 密码表单项。 */}
          <Form.Item
            className="mb-4.5!"
          >
            {/* 密码输入框。 */}
            <Input.Password
              value={userInfo.password}
              onChange={(event) => handleUserInfoChange("password", event.target.value)}
              placeholder={t("common.password")}
              prefix={<LockOutlined className="text-[#555]!" />}
              className="h-11.5! rounded-[10px]! text-[18px]!"
            />
          </Form.Item>

          {/* 图片验证码表单项。 */}
          <Form.Item
            className="mb-6!"
          >
            {/* 验证码输入框与图片。 */}
            <div className="flex gap-3">
              <Input
                value={userInfo.code}
                onChange={(event) => handleUserInfoChange("code", event.target.value)}
                placeholder="验证码"
                prefix={<SafetyCertificateOutlined className="text-[#555]!" />}
                className="h-11.5! flex-1! rounded-[10px]! text-[18px]!"
              />
              <button
                type="button"
                title="刷新验证码"
                aria-label="刷新验证码"
                onClick={handleRefreshCaptcha}
                disabled={captchaLoading}
                className="h-11.5 w-32 shrink-0 cursor-pointer overflow-hidden rounded-[10px] border border-[#d9d9d9] bg-white p-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {captchaImage ? (
                  <img
                    src={captchaImage}
                    alt="验证码"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-[#555]">刷新</span>
                )}
              </button>
            </div>
          </Form.Item>

          {/* 提交按钮表单项。 */}
          <Form.Item className="mb-0!">
            {/* 登录提交按钮。 */}
            <Button
              type="primary"
              htmlType="submit"
              loading={loginLoading}
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
