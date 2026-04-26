import axios, { AxiosError, AxiosHeaders } from "axios"; // 引入 axios、错误类型与请求头工具。
import { message } from "antd"; // 引入 antd 的全局消息提示。
import type { ApiResponse, RequestConfig, RequestMethods } from "./types"; // 引入请求层使用的共享类型。
const requestInstance = axios.create({
  // 创建 axios 实例。
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量读取接口基础地址。
  timeout: 10000, // 设置请求超时时间为 10 秒。
}); // 完成 axios 实例初始化。
const TOKEN_KEY = "token"; // 定义本地存储中的 token 键名。
let errorMessageVisible = false; // 记录当前是否已有错误提示在展示。
const showErrorOnce = (content: string) => {
  // 只展示一次错误消息的箭头函数。
  if (errorMessageVisible) {
    // 如果已有错误提示在显示则直接返回。
    return; // 阻止重复弹出错误提示。
  } // 结束重复展示判断。
  errorMessageVisible = true; // 标记错误提示已显示。
  void message.error(content, 2, () => {
    // 展示错误提示并在关闭后重置状态。
    errorMessageVisible = false; // 提示关闭后允许下一次错误继续展示。
  }); // 结束错误提示调用。
}; // 结束错误去重函数定义。
requestInstance.interceptors.request.use(
  // 注册统一请求拦截器。
  (config) => {
    // 处理发起请求前的配置。
    const token = localStorage.getItem(TOKEN_KEY); // 从本地存储中读取 token。
    if (token) {
      // 仅在 token 存在时注入请求头。
      const headers = AxiosHeaders.from(config.headers); // 统一转换为 AxiosHeaders 实例。
      headers.set("Authorization", `Bearer ${token}`); // 将 token 设置到 Authorization 请求头。
      config.headers = headers; // 回写处理后的请求头配置。
    } // 结束 token 注入判断。
    return config; // 返回处理后的请求配置。
  }, // 结束请求成功处理器。
  (error) => {
    // 处理请求发送前的异常。
    return Promise.reject(error); // 继续向外抛出请求阶段错误。
  }, // 结束请求失败处理器。
); // 完成请求拦截器注册。
requestInstance.interceptors.response.use(
  // 注册统一响应拦截器。
  (response) => {
    // 处理成功响应。
    const responseData = response.data as ApiResponse<unknown>; // 将响应体断言为统一响应结构。
    if (
      // 判断响应是否符合后端约定的数据结构。
      responseData && // 响应体必须存在。
      typeof responseData === "object" && // 响应体必须是对象。
      "code" in responseData && // 响应体必须包含状态码。
      "data" in responseData // 响应体必须包含业务数据。
    ) {
      // 结束统一结构判断。
      if (responseData.code !== 0) {
        // 非成功状态码直接按失败处理。
        return Promise.reject({
          // 返回一个被拒绝的 Promise。
          message: responseData.message || "请求失败", // 优先使用服务端返回的错误消息。
          config: response.config, // 保留原始请求配置供后续处理。
        }); // 结束自定义错误对象。
      } // 结束业务失败判断。
      return responseData.data; // 业务成功时只返回 data 字段。
    } // 结束统一响应结构分支。
    return response.data; // 非统一结构时原样返回响应数据。
  }, // 结束成功响应处理器。
  (error: AxiosError<ApiResponse<unknown>>) => {
    // 处理请求失败响应。
    const config = error.config as RequestConfig | undefined; // 读取当前请求配置。
    const shouldShowError = config?.showError !== false; // 判断当前请求是否需要弹错。
    const errorMessage = // 计算最终展示的错误文案。
      error.response?.data?.message || error.message || "网络异常，请稍后重试"; // 优先取服务端消息再退回到默认文案。
    if (shouldShowError) {
      // 仅在允许提示时展示错误。
      showErrorOnce(errorMessage); // 调用去重后的错误提示函数。
    } // 结束错误提示判断。
    return Promise.reject(error); // 继续向外抛出错误。
  }, // 结束失败响应处理器。
); // 完成响应拦截器注册。
export const request: RequestMethods = {
  // 导出统一请求对象。
  get: <T>(url: string, config?: RequestConfig) => {
    // 定义 GET 请求箭头函数。
    return requestInstance.get<never, T>(url, config); // 调用 axios 实例发送 GET 请求。
  }, // 结束 GET 方法定义。
  post: <T, D>(url: string, data?: D, config?: RequestConfig<D>) => {
    // 定义 POST 请求箭头函数。
    return requestInstance.post<never, T, D>(url, data, config); // 调用 axios 实例发送 POST 请求。
  }, // 结束 POST 方法定义。
}; // 结束请求对象导出。
