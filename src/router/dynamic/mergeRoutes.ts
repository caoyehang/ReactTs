import type { RouteObject } from "react-router-dom";

/**
 * 将一组 `RouteObject` 挂到指定 `id` 的节点下（常用于后端菜单/权限下发的子路由）。
 * 在拿到动态路由后：先 `buildRouteObjects(dynamicConfig)`，再与本函数合并，最后 `createBrowserRouter`。
 */
export function mergeRoutesUnderId(
  tree: RouteObject[],
  parentId: string,
  extra: RouteObject[],
): RouteObject[] {
  return tree.map((route) => {
    if (route.id === parentId && !route.index) {
      return {
        ...route,
        children: [...(route.children ?? []), ...extra],
      };
    }
    if (!route.index && route.children?.length) {
      return {
        ...route,
        children: mergeRoutesUnderId(route.children, parentId, extra),
      };
    }
    return route;
  });
}
