declare namespace IRouterType {
  interface IMeta {
    title: string;
  }
  interface IRouter {
    path: string;
    element: React.LazyExoticComponent<() => JSX.Element>;
    meta: IMeta;
    children?: IRouter[];
  }
}
