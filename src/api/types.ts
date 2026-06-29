// 引入 axios 请求配置和响应类型。
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// 定义通用接口响应结构。
export interface ApiResponse<T = unknown> {
  // 后端业务状态码。
  code: number;
  // 后端业务提示信息。
  message: string;
  // 实际业务数据。
  data: T;
}

// 扩展 axios 请求配置。
export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  // 控制当前请求是否展示错误提示。
  showError?: boolean;
}

// 定义请求对象支持的方法签名。
export interface RequestMethods {
  // 定义 GET 方法签名。
  get: <T = unknown>(url: string, config?: RequestConfig) => Promise<T>;
  // 定义 POST 方法签名。
  post: <T = unknown, D = unknown>(
    // 请求地址。
    url: string,
    // 请求体数据。
    data?: D,
    // 请求配置。
    config?: RequestConfig<D>,
  ) => Promise<T>;
}

// 定义登录请求参数。
export interface LoginParams {
  // 登录用户名。
  userName: string;
  // 登录密码。
  password: string;
}

// 定义登录接口返回的数据结构。
export interface LoginData {
  // 登录成功后的令牌。
  token: string;
  // 当前登录用户 ID。
  userId: string;
  // 当前登录用户名。
  username: string;
}

// 定义登录接口完整响应结构。
export type LoginResponse = ApiResponse<LoginData>;
// 定义成功响应类型别名。
export type ApiSuccessResponse<T = unknown> = AxiosResponse<ApiResponse<T>>;
