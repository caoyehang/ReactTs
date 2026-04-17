import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";

const fallback = <div className="loading-spinner" />;

function LazyRoute({
  Component,
}: {
  Component: React.LazyExoticComponent<() => React.ReactElement>;
}) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

/** 将业务路由配置转为 Data Router 使用的 `RouteObject`，`meta` 写入 `handle` 供 `useMatches` 使用 */
export function buildRouteObjects(routes: IRouterType.IRouter[]): RouteObject[] {
  return routes.map((route) => {
    const element =
      route.element !== undefined ? (
        <LazyRoute Component={route.element} />
      ) : undefined;

    return {
      path: route.path,
      id: route.id,
      element,
      handle: {
        meta: route.meta,
        name: route.name,
      },
      children: route.children?.length
        ? buildRouteObjects(route.children)
        : undefined,
    };
  });
}
