declare namespace IRouterType {
  type RouteElement = import("react").ReactNode;
  type AppRouteObject = import("react-router-dom").RouteObject;
  type RouteComponentImporter = () => Promise<{ default: () => JSX.Element }>;

  interface IMeta {
    title: string;
    icon?: string;
    keepAlive?: boolean;
  }

  interface IHandle {
    meta?: IMeta;
    name?: string;
  }

  interface IRouter {
    id?: string;
    index?: boolean;
    path?: string;
    name?: string;
    component?: RouteComponentImporter;
    element?: RouteElement;
    meta?: IMeta;
    handle?: IHandle;
    children?: IRouter[];
  }
}
