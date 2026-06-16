// 引入 Redux Toolkit 的切片创建函数和 action 类型。
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// 引入认证模块状态类型。
import type { AuthState } from "@/types";

// 定义认证模块初始状态。
const initialState: AuthState = {
  // Access Token 默认仅存于 Redux 内存状态。
  token: null,
  // 侧边栏默认保持展开。
  siderCollapsed: false,
};

// 创建认证与布局状态切片。
const authSlice = createSlice({
  // 指定切片名称。
  name: "auth",
  // 挂载初始状态。
  initialState,
  // 定义同步 reducers。
  reducers: {
    // 同步 token 到 Redux 状态。
    syncToken: (state, action: PayloadAction<string | null>) => {
      // 更新当前 token。
      state.token = action.payload;
    },
    // 切换侧边栏折叠状态。
    toggleSiderCollapsed: (state) => {
      // 反转当前折叠状态。
      state.siderCollapsed = !state.siderCollapsed;
    },
  },
});

// 导出切片自动生成的 actions。
export const { syncToken, toggleSiderCollapsed } = authSlice.actions;

// 默认导出认证切片 reducer。
export default authSlice.reducer;
