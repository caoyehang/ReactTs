import { Suspense, createElement, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, createBrowserRouter } from "react-router-dom";
import moduleRoutes from "./modules";

const routeLoading = createElement("div", { className: "loading-spinner" });

function renderLazyRoute(importer: IRouterType.RouteComponentImporter) {
  const Component = lazy(importer);

  return createElement(
    Suspense,
    { fallback: routeLoading },
    createElement(Component),
  );
}

const routes: IRouterType.IRouter[] = [
  {
    id: "layout",
    path: "/",
    meta: { title: "layout" },
    component: () => import("@/Layout/index"),
    children: [
      {
        index: true,
        element: createElement(Navigate, { to: "/home", replace: true }),
      },
      {
        id: "home",
        path: "/home",
        meta: { title: "首页" },
        component: () => import("@/pages/home/index"),
      },
      ...moduleRoutes,
    ],
  },
  {
    id: "login",
    path: "/login",
    meta: { title: "登录" },
    component: () => import("@/pages/login/index"),
  },
  {
    id: "not-found",
    path: "*",
    meta: { title: "404" },
    component: () => import("@/pages/notFound/index"),
  },
];

function normalizeRoutes(routes: IRouterType.IRouter[]): RouteObject[] {
  return routes.map(
    ({ children, component, meta, name, handle, element, ...route }) => ({
      ...route,
      element: element ?? (component ? renderLazyRoute(component) : undefined),
      handle: handle ?? { meta, name },
      children: children?.length ? normalizeRoutes(children) : undefined,
    }),
  );
}

export const appRoutes: RouteObject[] = normalizeRoutes(routes);
export const appRouter = createBrowserRouter(appRoutes);

export default appRouter;
