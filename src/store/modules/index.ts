// 引入 Redux Toolkit 的 reducer 聚合函数。
import { combineReducers } from "@reduxjs/toolkit";
// 引入认证模块 reducer。
import auth from "./auth";

// 聚合应用根 reducer。
const rootReducer = combineReducers({
  // 挂载认证与布局状态模块。
  auth,
});

// 默认导出根 reducer。
export default rootReducer;
