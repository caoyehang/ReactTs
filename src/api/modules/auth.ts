// 引入登录相关类型定义。
import type { LoginData, LoginParams } from "../types";
// 引入统一请求对象。
import { request } from "../request";

// 定义登录接口方法。
export const login = (data: LoginParams) => {
  // 发送登录 POST 请求并返回 data 字段。
  return request.post<LoginData, LoginParams>("/login", data);
};
