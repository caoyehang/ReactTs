import type { LoginData, LoginParams } from "../types"; // 引入登录相关类型定义。
import { request } from "../request"; // 引入统一请求实例。
export const login = (data: LoginParams) => {
  // 使用箭头函数定义登录请求。
  return request.post<LoginData, LoginParams>("/login", data); // 发送登录 POST 请求并返回 data 字段。
}; // 结束登录方法定义。
