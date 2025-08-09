// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

//
createRoot(document.getElementById("root")!).render(
  // 关闭严格模式, 不关闭的话：如果在项目中使用了废弃或已经即将淘汰或已过时的接口语法时候会报错
  // <StrictMode>
  <App />
  // </StrictMode>,
);
