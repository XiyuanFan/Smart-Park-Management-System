import { RouteObject } from "react-router-dom";
import { componentMap } from "../router/routerMap";
interface MenuType {
    icon: string;
    key: string;
    label: string;
    children?: MenuType[]
}

//菜单驱动路由
//通过递归把菜单树转换成路由数组 RouteObject[]
export function generateRoutes(menu: MenuType[]): RouteObject[] {
    return menu.map((item: MenuType) => {
        const hasChildren = item.children
        let routerObj: RouteObject = {
            path: item.key,
            element: hasChildren ? null : <>{componentMap[item.key]}</>
        };
        if (item.children) {
            routerObj.children = generateRoutes(item.children)
        }
        return routerObj
    })

}