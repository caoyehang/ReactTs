// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // 关闭严格模式
  // <StrictMode>
  <App />
  // </StrictMode>,
);
