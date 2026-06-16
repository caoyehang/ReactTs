// 引入会员模块路由。
import memberRoutes from "./member";

// 聚合所有业务模块路由。
const moduleRoutes: IRouterType.IRouter[] = [...memberRoutes];

// 默认导出模块路由集合。
export default moduleRoutes;
