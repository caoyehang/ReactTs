declare namespace IRouterType {
  interface IMeta {
    title: string;
    icon?: string;
    keepAlive?: boolean;
  }
  interface IRouter {
    /** 与 `RouteObject.id` 对齐，便于合并动态子路由、调试与权限绑定 */
    id?: string;
    path: string;
    name?: string;
    element?: React.LazyExoticComponent<() => JSX.Element>;
    meta: IMeta;
    children?: IRouter[];
  }
}
