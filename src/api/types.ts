import type { AxiosRequestConfig, AxiosResponse } from "axios"; // 引入 axios 配置和响应类型。
export interface ApiResponse<T = unknown> {
  // 定义通用接口响应结构。
  code: number; // 业务状态码。
  message: string; // 业务提示信息。
  data: T; // 实际业务数据。
} // 结束通用响应结构定义。
export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  // 扩展 axios 请求配置。
  showError?: boolean; // 控制当前请求是否展示错误提示。
} // 结束请求配置定义。
export interface RequestMethods {
  // 定义请求对象支持的方法。
  get: <T = unknown>(url: string, config?: RequestConfig) => Promise<T>; // 定义 GET 方法签名。
  post: <T = unknown, D = unknown>( // 定义 POST 方法签名。
    url: string, // 请求地址。
    data?: D, // 请求体数据。
    config?: RequestConfig<D>, // 请求配置。
  ) => Promise<T>; // POST 方法返回 Promise。
} // 结束请求方法类型定义。
export interface LoginParams {
  // 定义登录请求参数。
  username: string; // 登录用户名。
  password: string; // 登录密码。
} // 结束登录参数定义。
export interface LoginData {
  // 定义登录接口 data 字段的数据结构。
  token: string; // 登录成功后的令牌。
  userId: string; // 当前登录用户 ID。
  username: string; // 当前登录用户名。
} // 结束登录 data 结构定义。
export type LoginResponse = ApiResponse<LoginData>; // 定义登录接口完整响应结构，包含 code、message、data。
export type ApiSuccessResponse<T = unknown> = AxiosResponse<ApiResponse<T>>; // 定义成功响应类型别名。
