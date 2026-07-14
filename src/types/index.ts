// 定义认证模块状态结构。
export type AuthState = {
  // 当前登录 token。
  token: string | null;
  // 侧边栏是否折叠。
  siderCollapsed: boolean;
};

// 定义登录表单字段结构。
export interface LoginFormValues {
  // 用户名字段。
  username: string;
  // 密码字段。
  password: string;
  // 图片验证码字段。
  code: string;
  // 图片验证码唯一标识。
  uuid: string;
}
