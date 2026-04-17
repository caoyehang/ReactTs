import type { RouteObject } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

/** 统一路由实例创建入口，后续可在这里接入 basename、future flags 或 hydration 配置。 */
export function createAppRouter(routeObjects: RouteObject[]) {
  return createBrowserRouter(routeObjects);
}
