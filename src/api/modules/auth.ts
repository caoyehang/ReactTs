// 引入登录相关类型定义。
import type { CaptchaImageResponse, LoginData, LoginParams } from "../types";
// 引入统一请求对象。
import { request } from "../request";

// 定义登录接口方法。
export const login = (data: LoginParams) => {
  // 发送登录 GET 请求，并通过查询参数传递登录字段。
  return request.get<LoginData>("/user/login", {
    params: data,
  });
};

// 定义图片验证码接口方法。
export const getCaptchaImage = () => {
  // 获取登录页图片验证码。
  return request.get<CaptchaImageResponse>("/user/captchaImage", { showError: false });
};
