// 引入 Redux Toolkit 的 store 创建函数。
import { configureStore } from "@reduxjs/toolkit";
// 引入 react-redux 的 hooks 与 selector 类型工具。
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
// 引入聚合后的根 reducer。
import rootReducer from "./modules";

// 创建并导出应用 Redux store。
export const store = configureStore({
  // 挂载根 reducer。
  reducer: rootReducer,
});

// 推导并导出全局状态类型。
export type RootState = ReturnType<typeof store.getState>;
// 推导并导出 dispatch 类型。
export type AppDispatch = typeof store.dispatch;

// 导出带类型的 dispatch Hook。
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// 导出带类型的 selector Hook。
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
