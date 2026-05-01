// 引入 Redux Toolkit 的 configureStore，用于创建全局 store。
import { configureStore } from "@reduxjs/toolkit";
// 从 react-redux 中引入 dispatch、selector 以及对应的类型工具。
import {
  // 引入 useDispatch，用于创建带类型的 dispatch hook。
  useDispatch,
  // 引入 useSelector，用于读取 store 中的状态。
  useSelector,
  // 引入 TypedUseSelectorHook 类型，用于约束 selector 的返回类型。
  type TypedUseSelectorHook,
  // 结束 react-redux 的多行导入。
} from "react-redux";
// 引入由 modules 聚合出的根 reducer。
import rootReducer from "./modules";

// 创建并导出项目的 Redux store。
export const store = configureStore({
  // 把聚合后的根 reducer 挂到 store 上。
  reducer: rootReducer,
  // 结束 store 配置对象。
});

// 推导并导出整个 store 的根状态类型。
export type RootState = ReturnType<typeof store.getState>;
// 推导并导出 dispatch 的类型。
export type AppDispatch = typeof store.dispatch;

// 基于 AppDispatch 导出带类型的 dispatch hook。
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// 基于 RootState 导出带类型的 selector hook。
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
