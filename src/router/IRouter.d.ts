declare namespace IRouterType {
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
    element?: React.ReactNode;
    meta?: IMeta;
    handle?: IHandle;
    children?: IRouter[];
  }
}
