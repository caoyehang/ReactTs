import { message } from "antd";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";

// 请求基础配置：统一超时、token 存储键和环境变量中的 API 地址。
const DEFAULT_TIMEOUT = 10_000;
const TOKEN_STORAGE_KEY = "access_token";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[];

export type QueryParams = Record<string, QueryValue>;

// 对外暴露的请求配置：在 axios 原生配置上补充 query/body 等语义化字段。
export interface RequestConfig extends Omit<
  AxiosRequestConfig,
  "params" | "data" | "url" | "method"
> {
  method?: Method;
  baseURL?: string;
  query?: QueryParams;
  body?: unknown;
  silentError?: boolean;
  withToken?: boolean;
}

// 运行时配置：用于把自定义字段安全传递到 axios 请求链路中。
interface RequestRuntimeConfig<D = unknown> extends AxiosRequestConfig<D> {
  silentError?: boolean;
  withToken?: boolean;
}

// 拦截器内部读取的配置类型，和 RequestRuntimeConfig 保持一致。
interface InternalRequestRuntimeConfig<
  D = unknown,
> extends InternalAxiosRequestConfig<D> {
  silentError?: boolean;
  withToken?: boolean;
}

let memoryToken = "";
let isMessageVisible = false;

// 优先读取内存中的 token，避免每次请求都访问 localStorage。
function getStoredToken() {
  if (memoryToken) {
    return memoryToken;
  }

  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
}

// 登录后写入 token，同时同步到 localStorage，便于刷新后恢复。
export function setAccessToken(token: string) {
  memoryToken = token.trim();

  if (typeof window !== "undefined") {
    if (memoryToken) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, memoryToken);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
}

export function clearAccessToken() {
  setAccessToken("");
}

export function getAccessToken() {
  return getStoredToken();
}

// 并发报错时只弹一个消息，避免连续请求失败造成提示轰炸。
function showErrorMessageOnce(content: string) {
  if (isMessageVisible) {
    return;
  }

  isMessageVisible = true;
  message.error({
    content,
    duration: 2,
    onClose: () => {
      isMessageVisible = false;
    },
  });
}

// 过滤掉值为 undefined 的查询参数，避免生成多余的 query string。
function normalizeQuery(query?: QueryParams) {
  if (!query) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined),
  );
}

// 统一提取后端或网络层错误信息，供响应拦截器和请求兜底复用。
function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; msg?: string }>;

  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.msg ??
    axiosError.message ??
    "请求失败，请稍后重试"
  );
}

// 请求拦截器：默认自动挂载 Bearer Token，也支持按请求关闭。
function handleRequestConfig(config: InternalAxiosRequestConfig) {
  const runtimeConfig = config as InternalRequestRuntimeConfig;
  const token = getStoredToken();

  if (token && runtimeConfig.withToken !== false) {
    runtimeConfig.headers.Authorization ??= `Bearer ${token}`;
  }

  return runtimeConfig;
}

// 响应错误统一处理，支持 silentError 静默关闭全局提示。
function handleResponseError(error: unknown) {
  const config = (error as AxiosError).config as
    | InternalRequestRuntimeConfig
    | undefined;

  if (!config?.silentError) {
    showErrorMessageOnce(getErrorMessage(error));
  }

  return Promise.reject(error);
}

// 项目统一 axios 实例：所有接口请求都应优先基于该实例发起。
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

httpClient.interceptors.request.use(handleRequestConfig, handleResponseError);
httpClient.interceptors.response.use(
  (response) => response,
  handleResponseError,
);

// 通用请求入口：兼容常规 axios 配置，同时统一 query/body 的调用习惯。
export async function request<T>(
  url: string,
  config: RequestConfig = {},
): Promise<T | null> {
  const {
    method = "GET",
    query,
    body,
    silentError,
    withToken,
    ...axiosConfig
  } = config;

  const requestConfig: RequestRuntimeConfig = {
    url,
    method,
    params: normalizeQuery(query),
    data: body,
    silentError,
    withToken,
    ...axiosConfig,
  };

  try {
    const response: AxiosResponse<T> = await httpClient.request<
      T,
      AxiosResponse<T>
    >(requestConfig);

    return response.data;
  } catch {
    return null;
  }
}

// 便捷方法：覆盖常见 HTTP 动词，减少业务层重复传 method。
export function get<T>(
  url: string,
  config?: Omit<RequestConfig, "method" | "body">,
) {
  return request<T>(url, {
    ...config,
    method: "GET",
  });
}

export function post<T, D = unknown>(
  url: string,
  body?: D,
  config?: Omit<RequestConfig, "method" | "body">,
) {
  return request<T>(url, {
    ...config,
    method: "POST",
    body,
  });
}

export function put<T, D = unknown>(
  url: string,
  body?: D,
  config?: Omit<RequestConfig, "method" | "body">,
) {
  return request<T>(url, {
    ...config,
    method: "PUT",
    body,
  });
}

export function patch<T, D = unknown>(
  url: string,
  body?: D,
  config?: Omit<RequestConfig, "method" | "body">,
) {
  return request<T>(url, {
    ...config,
    method: "PATCH",
    body,
  });
}

export function del<T>(
  url: string,
  config?: Omit<RequestConfig, "method" | "body">,
) {
  return request<T>(url, {
    ...config,
    method: "DELETE",
  });
}

export default httpClient;
