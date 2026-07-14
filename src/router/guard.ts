// 引入重定向工具，用于在路由加载阶段拦截未登录访问。
import { redirect } from "react-router-dom";
// 引入 Redux store，和请求拦截器保持同一个 token 来源。
import { store } from "@/store";

// 登录页路径。
const LOGIN_PATH = "/login";

// 登录态路由守卫：没有 token 时统一回到登录页。
export const authGuard = () => {
  const token = store.getState().auth.token;

  if (!token) {
    throw redirect(LOGIN_PATH);
  }

  return null;
};
