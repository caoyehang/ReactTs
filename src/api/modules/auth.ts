// 引入登录相关类型定义。
import type { CaptchaImageResponse, LoginData, LoginParams } from "../types";
// 引入统一请求对象。
import { request } from "../request";

// 定义登录接口方法。
export const login = (data: LoginParams) => {
  // 发送登录 POST 请求并返回 data 字段。
  return request.post<LoginData, LoginParams>("/user/login", data);
};

// 定义图片验证码接口方法。
export const getCaptchaImage = () => {
  // 获取登录页图片验证码。
  return request.get<CaptchaImageResponse>("/user/captchaImage", { showError: false });
};
