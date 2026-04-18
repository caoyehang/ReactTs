import { message } from "antd";
import axios, { AxiosError, type AxiosRequestConfig, type Method } from "axios";

// 默认请求超时时间（毫秒）。
const DEFAULT_TIMEOUT = 10_000;
// query 参数支持的基础类型。
type Primitive = string | number | boolean | null | undefined;
// 单个 query 字段可为单值或数组。
type QueryValue = Primitive | Primitive[];
// query 参数对象类型。
export type QueryParams = Record<string, QueryValue>;

// 统一请求入参：对 axios 配置做语义化封装（query/body）。
export interface RequestConfig extends Omit<AxiosRequestConfig, "params" | "data" | "url" | "method"> {
  // HTTP 方法，默认 GET。
  method?: Method;
  // 可按请求覆盖 baseURL（不传则使用实例默认值）。
  baseURL?: string;
  // URL 查询参数（会映射到 axios params）。
  query?: QueryParams;
  // 请求体（会映射到 axios data）。
  body?: unknown;
}

// 创建 axios 实例：baseURL 来自 env，便于区分 dev/test/prod 环境。
const axiosInstance = axios.create({
  // Vite 环境变量读取（如 .env.development 中的 VITE_API_BASE_URL）。
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  // 全局默认超时。
  timeout: DEFAULT_TIMEOUT,
});

// 控制并发请求出错时只展示一个错误弹窗。
let isMessageVisible = false;

function showErrorMessageOnce(content: string) {
  if (isMessageVisible) return;
  isMessageVisible = true;
  message.error({
    content,
    duration: 2,
    onClose: () => {
      isMessageVisible = false;
    },
  });
}

// 请求拦截器：预留 token、签名、租户信息等统一注入点。
axiosInstance.interceptors.request.use((config) => {
  // 后续可在这里注入 token、租户信息、traceId 等。
  return config;
});

// 对外统一请求函数：兼容 request<T>(url, { method, query, body }) 调用方式。
export async function request<T>(url: string, config: RequestConfig = {}): Promise<T | null> {
  try {
    // 发起请求并把语义化字段映射到 axios 字段。
    const response = await axiosInstance.request<T>({
      // 请求路径。
      url,
      // 请求方法（默认 GET）。
      method: config.method ?? "GET",
      // 单次覆盖 baseURL。
      baseURL: config.baseURL,
      // query -> params。
      params: config.query,
      // body -> data。
      data: config.body,
      // 合并其余 axios 配置（headers/timeout/signal 等）。
      ...config,
    });

    // 不处理后端业务码，直接返回响应体。
    return response.data;
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const errMsg =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      "请求失败，请稍后重试";
    showErrorMessageOnce(errMsg);
    return null;
  }
}

