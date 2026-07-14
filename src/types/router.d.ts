// 声明全局路由类型命名空间，方便路由配置文件直接复用。
declare namespace IRouterType {
  // 定义路由渲染元素类型。
  type RouteElement = import("react").ReactNode;
  // 复用 React Router 的标准 RouteObject 类型。
  type AppRouteObject = import("react-router-dom").RouteObject;
  // 复用 React Router 的 loader 类型。
  type RouteLoader = import("react-router-dom").LoaderFunction;
  // 定义页面组件动态导入函数类型。
  type RouteComponentImporter = () => Promise<{ default: () => JSX.Element }>;

  // 定义路由元信息结构。
  interface IMeta {
    // 路由标题翻译 key。
    title: string;
    // 菜单图标元素。
    icon?: RouteElement;
    // 页面是否需要缓存的业务标记。
    keepAlive?: boolean;
  }

  // 定义挂载到 React Router handle 上的结构。
  interface IHandle {
    // 路由元信息。
    meta?: IMeta;
    // 路由名称。
    name?: string;
  }

  // 定义项目内部使用的路由配置结构。
  interface IRouter {
    // 路由唯一标识。
    id?: string;
    // 是否为 index 路由。
    index?: boolean;
    // 路由路径。
    path?: string;
    // 路由名称。
    name?: string;
    // 路由页面动态导入函数。
    component?: RouteComponentImporter;
    // 已创建好的路由元素。
    element?: RouteElement;
    // 路由元信息。
    meta?: IMeta;
    // 自定义 handle 信息。
    handle?: IHandle;
    // 路由加载守卫或数据加载函数。
    loader?: RouteLoader;
    // 子路由列表。
    children?: IRouter[];
  }
}
