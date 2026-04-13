declare namespace IRouterType {
  interface IMeta {
    title: string;
    icon?: string;
    keepAlive?: boolean;
  }
  interface IRouter {
    path: string;
    name?: string;
    element?: React.LazyExoticComponent<() => JSX.Element>;
    meta: IMeta;
    children?: IRouter[];
  }
}
