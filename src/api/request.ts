import { message } from "antd";
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  ApiResponse,
  FormDataValue,
  InternalRequestRuntimeConfig,
  QueryParams,
  RequestConfig,
  RequestRuntimeConfig,
} from "./types";

// 请求基础配置：统一超时和环境变量中的 API 地址。
const DEFAULT_TIMEOUT = 10_000;
// 从环境变量读取接口根地址，避免业务代码散落硬编码。
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

// 控制错误消息的串行显示，避免并发请求连续弹窗。
let isMessageVisible = false;
// token 由外部 store 注入 getter，这里只负责读取。
let accessTokenGetter: (() => string | undefined | null) | undefined;

// 统一读取外部 store 中的 token，并在空值场景下返回空字符串。
const getStoredToken = () => {
  return accessTokenGetter?.()?.trim() ?? "";
};

// 暴露给业务层注册 token getter，便于接入 pinia 或其他状态管理。
export const setAccessTokenGetter = (
  getter?: () => string | undefined | null,
) => {
  accessTokenGetter = getter;
};

// 对外保留 token 读取方法，供少量需要主动取 token 的场景复用。
export const getAccessToken = () => {
  return getStoredToken();
};

// 并发报错时只弹一个消息，避免连续请求失败造成提示轰炸。
const showErrorMessageOnce = (content: string) => {
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
};

// 过滤掉值为 undefined 的查询参数，避免生成多余的 query string。
const normalizeQuery = (query?: QueryParams) => {
  // 没有 query 时直接透传 undefined。
  if (!query) {
    return undefined;
  }

  // 仅移除 undefined，保留 null 和 false 等有效值。
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined),
  );
};

// 统一提取后端或网络层错误信息，供响应拦截器和请求兜底复用。
const getErrorMessage = (error: unknown) => {
  // 仅从后端响应体的 message 字段读取提示文案。
  const axiosError = error as AxiosError<ApiResponse>;

  // 后端未返回 message 时回退到通用提示。
  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.msg ??
    axiosError.message ??
    "请求失败，请稍后重试"
  );
};

// Blob 和 File 都属于可直接上传的文件类型。
const isFileLike = (value: unknown): value is Blob => {
  return value instanceof Blob;
};

// 递归判断数据里是否包含文件，包含时转成 FormData。
const hasFileValue = (value: unknown): boolean => {
  // 单个文件对象直接视为上传数据。
  if (isFileLike(value)) {
    return true;
  }

  // FileList 里有文件时同样视为上传数据。
  if (value instanceof FileList) {
    return value.length > 0;
  }

  // 数组场景递归检查每一项。
  if (Array.isArray(value)) {
    return value.some((item) => hasFileValue(item));
  }

  // 普通对象场景递归检查属性值。
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => hasFileValue(item));
  }

  // 其他类型都不属于文件上传数据。
  return false;
};

// 追加基础字段到 FormData，文件按原值追加，普通值统一转字符串。
const appendFormData = (
  formData: FormData,
  key: string,
  value: FormDataValue,
) => {
  // 空值字段直接跳过。
  if (value === undefined || value === null) {
    return;
  }

  // 文件对象直接追加，交给浏览器处理 multipart 编码。
  if (isFileLike(value)) {
    formData.append(key, value);
    return;
  }

  // 非文件值统一转字符串，兼容数字和布尔值。
  formData.append(key, String(value));
};

// 递归拍平复杂对象，构造成后端常见的 multipart 字段格式。
const appendFormDataEntry = (
  formData: FormData,
  key: string,
  value: unknown,
) => {
  // 空值字段直接跳过。
  if (value === undefined || value === null) {
    return;
  }

  // FileList 逐个追加，支持 input[type=file] 多选。
  if (value instanceof FileList) {
    Array.from(value).forEach((file) => {
      appendFormData(formData, key, file);
    });
    return;
  }

  // 数组值使用 key[] 形式展开。
  if (Array.isArray(value)) {
    value.forEach((item) => {
      appendFormDataEntry(formData, `${key}[]`, item);
    });
    return;
  }

  // 文件或基础类型直接作为最终值追加。
  if (isFileLike(value) || typeof value !== "object") {
    appendFormData(formData, key, value as FormDataValue);
    return;
  }

  // 嵌套对象使用 key[child] 形式递归展开。
  Object.entries(value).forEach(([childKey, childValue]) => {
    appendFormDataEntry(formData, `${key}[${childKey}]`, childValue);
  });
};

// 把包含文件的普通对象统一转换成 FormData。
const toFormData = (data: Record<string, unknown>) => {
  // 创建一个新的 FormData 容器。
  const formData = new FormData();

  // 遍历对象并递归写入字段。
  Object.entries(data).forEach(([key, value]) => {
    appendFormDataEntry(formData, key, value);
  });

  // 返回转换后的 multipart 数据。
  return formData;
};

// 规范化请求体：有文件则自动转 FormData，没有文件则保持原值。
const normalizeRequestData = (data: unknown) => {
  // 空数据直接透传。
  if (!data) {
    return data;
  }

  // 已经是 FormData 时不重复处理。
  if (data instanceof FormData) {
    return data;
  }

  // 普通对象里含文件时自动转换成 FormData。
  if (typeof data === "object" && hasFileValue(data)) {
    return toFormData(data as Record<string, unknown>);
  }

  // 其余数据按原样返回。
  return data;
};

// 删除 multipart 请求里的 Content-Type，让浏览器自动补 boundary。
const removeContentTypeHeader = (
  headers?: AxiosRequestConfig["headers"],
): AxiosRequestConfig["headers"] => {
  // 没有 headers 时直接返回 undefined。
  if (!headers) {
    return headers;
  }

  // AxiosHeaders 实例使用其原生 delete 方法删除头字段。
  if (headers instanceof AxiosHeaders) {
    headers.delete("Content-Type");
    headers.delete("content-type");
    return headers;
  }

  // 普通对象场景复制一份，避免直接修改外部传入对象。
  const normalizedHeaders = {
    ...headers,
  } as Record<string, string>;

  // 同时删除大小写两种常见写法。
  delete normalizedHeaders["Content-Type"];
  delete normalizedHeaders["content-type"];

  // 返回清理后的 headers。
  return normalizedHeaders;
};

// 规范化 headers 和 data，确保文件上传和 JSON 请求都能走统一入口。
const normalizeRequestHeaders = (
  headers: AxiosRequestConfig["headers"],
  data: unknown,
): {
  headers: AxiosRequestConfig["headers"];
  data: unknown;
} => {
  // 先统一处理请求体。
  const normalizedData = normalizeRequestData(data);

  // 非 FormData 请求保留原始 headers 即可。
  if (!(normalizedData instanceof FormData)) {
    return {
      headers,
      data: normalizedData,
    };
  }

  // FormData 请求移除手写 Content-Type，避免 boundary 错误。
  return {
    headers: removeContentTypeHeader(headers),
    data: normalizedData,
  };
};

// 请求拦截器：默认自动挂载 Bearer Token，也支持按请求关闭。
const handleRequestConfig = (config: InternalAxiosRequestConfig) => {
  // 转成带自定义字段的运行时配置，方便读取 withToken。
  const runtimeConfig = config as InternalRequestRuntimeConfig;
  // 从外部 store 读取当前 token。
  const token = getStoredToken();

  // 有 token 且未主动关闭时，自动挂载 Authorization。
  if (token && runtimeConfig.withToken !== false) {
    runtimeConfig.headers.Authorization ??= `Bearer ${token}`;
  }

  // 返回处理后的配置供 axios 继续发送请求。
  return runtimeConfig;
};

// 响应错误统一处理，支持 silentError 静默关闭全局提示。
const handleResponseSuccess = <T>(response: {
  data: ApiResponse<T>;
  config: InternalAxiosRequestConfig;
}) => {
  const runtimeConfig = response.config as InternalRequestRuntimeConfig;
  const responseData = response.data;

  if (responseData.code !== 200) {
    if (!runtimeConfig.silentError) {
      showErrorMessageOnce(
        responseData.message ?? responseData.msg ?? "请求失败，请稍后重试",
      );
    }

    return Promise.reject(
      new Error(
        responseData.message ?? responseData.msg ?? "请求失败，请稍后重试",
      ),
    );
  }

  return responseData.data;
};

// 响应错误统一处理，支持 silentError 静默关闭全局提示。
const handleResponseError = (error: unknown) => {
  // 读取请求配置，判断本次请求是否要求静默。
  const config = (error as AxiosError).config as
    | InternalRequestRuntimeConfig
    | undefined;

  // 仅在非静默场景下展示后端 message。
  if (!config?.silentError) {
    showErrorMessageOnce(getErrorMessage(error));
  }

  // 继续向上抛出错误，方便业务层按需捕获。
  return Promise.reject(error);
};

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
  handleResponseSuccess,
  handleResponseError,
);

// 通用请求入口：兼容常规 axios 配置，同时统一 query/body 的调用习惯。
export const request = async <T>(
  url: string,
  config: RequestConfig = {},
): Promise<T | null> => {
  // 解构出封装层约定字段，其余配置原样透传给 axios。
  const {
    method = "GET",
    query,
    data,
    silentError,
    withToken,
    ...axiosConfig
  } = config;

  // 统一把请求方法转成大写，避免大小写差异。
  const normalizedMethod = method.toUpperCase();
  // get 请求使用 query，其余请求也允许透传 params 语义化字段。
  const normalizedQuery =
    normalizedMethod === "GET" ? normalizeQuery(query) : query;
  // 统一处理 data 和 headers，兼容 JSON 与文件上传。
  const normalizedRequest = normalizeRequestHeaders(axiosConfig.headers, data);

  // 组装最终请求配置。
  const requestConfig: RequestRuntimeConfig = {
    url,
    method: normalizedMethod,
    params: normalizedQuery,
    data: normalizedRequest.data,
    silentError,
    withToken,
    headers: normalizedRequest.headers,
    ...axiosConfig,
  };

  try {
    // 发起请求并在响应拦截器中统一解包业务数据。
    const response = await httpClient.request<ApiResponse<T>, T>(requestConfig);

    // 请求成功时返回业务 data。
    return response;
  } catch {
    // 错误提示已由拦截器统一处理，这里只返回 null 给业务层兜底。
    return null;
  }
};

// 便捷方法：覆盖常见 HTTP 动词，减少业务层重复传 method。
export const get = <T>(
  url: string,
  config?: Omit<RequestConfig, "method" | "data">,
) => {
  return request<T>(url, {
    ...config,
    method: "GET",
  });
};

export const post = <T, D = unknown>(
  url: string,
  data?: D,
  config?: Omit<RequestConfig, "method" | "data">,
) => {
  return request<T>(url, {
    ...config,
    method: "POST",
    data,
  });
};

export default httpClient;
