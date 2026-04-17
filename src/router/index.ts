import staticRouteConfig from "./config";
import { buildRouteObjects } from "./buildRouteObjects";
import { createAppRouter } from "./createAppRouter";

// 1) 业务配置 -> RouteObject（适配 React Router v7 Data Router）。
export const routeObjects = buildRouteObjects(staticRouteConfig);

// 2) RouteObject -> 浏览器路由实例（供 RouterProvider 使用）。
export const appRouter = createAppRouter(routeObjects);

// 对外暴露基础能力，方便在权限初始化阶段扩展动态路由。
export { staticRouteConfig, buildRouteObjects, createAppRouter };
export { mergeRoutesUnderId } from "./dynamic/mergeRoutes";

// 兼容旧用法：仍可直接拿到静态路由配置。
export default staticRouteConfig;
