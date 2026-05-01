// 从 Redux Toolkit 中引入 createSlice 和 PayloadAction 类型。
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// 引入认证模块使用的状态类型。
import type { AuthState } from "@/types";

// 定义认证模块的初始状态对象。
const initialState: AuthState = {
  // Access Token 仅保存在 Redux 内存中，首次加载时默认为空。
  token: null,
  // 统一保存侧边栏折叠状态，供 Header 与 Sider 共享。
  siderCollapsed: false,
  // 结束初始状态对象定义。
};

// 创建认证状态切片。
const authSlice = createSlice({
  // 指定当前切片名称。
  name: "auth",
  // 挂载认证模块的初始状态。
  initialState,
  // 定义当前切片包含的 reducer。
  reducers: {
    // 定义同步 token 到 Redux 与持久化层的 reducer。
    syncToken: (state, action: PayloadAction<string | null>) => {
      // 更新 Redux 中保存的 token。
      state.token = action.payload;
      // 结束 syncToken reducer。
    },
    // 切换侧边栏折叠状态，避免布局组件各自维护本地状态。
    toggleSiderCollapsed: (state) => {
      state.siderCollapsed = !state.siderCollapsed;
    },
    // 结束 reducers 配置对象。
  },
  // 结束 createSlice 配置对象。
});

// 导出切片自动生成的认证与布局 action。
export const { syncToken, toggleSiderCollapsed } = authSlice.actions;

// 默认导出认证切片 reducer。
export default authSlice.reducer;
