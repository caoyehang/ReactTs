// 引入 axios、错误类型和请求头工具。
import axios, { AxiosError, AxiosHeaders } from "axios";
// 引入 antd 全局消息提示。
import { message } from "antd";
// 引入 Redux store，用于请求拦截器读取 token。
import { store } from "@/store";
// 引入请求层共享类型。
import type { ApiResponse, RequestConfig, RequestMethods } from "./types";

// 创建统一 axios 实例。
const requestInstance = axios.create({
  // 从环境变量读取接口基础地址。
  baseURL: import.meta.env.VITE_BASE_API_URL,
  // 设置请求超时时间为 10 秒。
  timeout: 10000,
});

// 记录当前是否已有错误提示在展示。
let errorMessageVisible = false;

// 展示去重后的错误消息。
const showErrorOnce = (content: string) => {
  // 如果已经有错误提示，则跳过本次展示。
  if (errorMessageVisible) {
    return;
  }

  // 标记错误提示正在展示。
  errorMessageVisible = true;
  // 展示错误提示并在关闭后恢复可展示状态。
  void message.error(content, 2, () => {
    // 提示关闭后允许下一次错误继续展示。
    errorMessageVisible = false;
  });
};

// 注册统一请求拦截器。
requestInstance.interceptors.request.use(
  // 处理请求发送前的配置。
  (config) => {
    // 从 Redux 内存状态读取当前 token。
    const token = store.getState().auth.token;
    // 仅在 token 存在时注入认证请求头。
    if (token) {
      // 把请求头统一转换为 AxiosHeaders 实例。
      const headers = AxiosHeaders.from(config.headers);
      // 写入 Bearer Token。
      headers.set("Authorization", `Bearer ${token}`);
      // 回写处理后的请求头配置。
      config.headers = headers;
    }
    // 返回最终请求配置。
    return config;
  },
  // 处理请求发送前的异常。
  (error) => {
    // 将异常继续向调用方抛出。
    return Promise.reject(error);
  },
);

// 注册统一响应拦截器。
requestInstance.interceptors.response.use(
  // 处理成功响应。
  (response) => {
    // 把响应体视为后端统一响应结构。
    const responseData = response.data as ApiResponse<unknown>;
    // 判断响应是否包含业务状态码。
    if (
      responseData &&
      typeof responseData === "object" &&
      "code" in responseData
    ) {
      // 非成功状态码按业务错误处理，兼容 code 为 0 或 200 的后端。
      if (responseData.code !== 0 && responseData.code !== 200) {
        // 抛出包含原始请求配置的业务错误。
        return Promise.reject({
          message: responseData.message || responseData.msg || "请求失败",
          config: response.config,
        });
      }
      // 成功时优先返回 data 字段；没有 data 的接口保留原响应体。
      if ("data" in responseData) {
        return responseData.data;
      }
    }
    // 非统一结构时原样返回响应体。
    return response.data;
  },
  // 处理失败响应。
  (error: AxiosError<ApiResponse<unknown>>) => {
    // 读取当前请求配置。
    const config = error.config as RequestConfig | undefined;
    // 判断当前请求是否允许展示错误提示。
    const shouldShowError = config?.showError !== false;
    // 计算最终展示给用户的错误文案。
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.msg ||
      error.message ||
      "网络异常，请稍后重试";
    // 在允许提示时展示错误消息。
    if (shouldShowError) {
      showErrorOnce(errorMessage);
    }
    // 将错误继续抛给业务调用方。
    return Promise.reject(error);
  },
);

// 导出业务层使用的统一请求方法集合。
export const request: RequestMethods = {
  // 定义 GET 请求方法。
  get: <T>(url: string, config?: RequestConfig) => {
    // 调用 axios 实例发送 GET 请求。
    return requestInstance.get<never, T>(url, config);
  },
  // 定义 POST 请求方法。
  post: <T, D>(url: string, data?: D, config?: RequestConfig<D>) => {
    // 调用 axios 实例发送 POST 请求。
    return requestInstance.post<never, T, D>(url, data, config);
  },
};
