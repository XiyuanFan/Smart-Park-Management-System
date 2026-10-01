import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "../utils/RequireAuth";
import { RouteObject } from "react-router-dom";
const Home = React.lazy(() => import("../page/home"));
const Login = React.lazy(() => import("../page/login"));
const NotFound = React.lazy(() => import("../page/404"));

// const router=createBrowserRouter([
//     {
//         path:"/",
//         element: <RequireAuth allowed={true} redirectTo="/login"> <Home/> </RequireAuth> 
//     },
//     {
//         path:"/login",
//         element:<RequireAuth allowed={false} redirectTo="/"> <Login/> </RequireAuth> 
//     },
//     {
//         path:"*",
//         element:<NotFound/>
//     }    
// ])

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <RequireAuth allowed={true} redirectTo="/login"> <Home /> </RequireAuth>
        // RequireAuth实现路由守卫；当前路由需要登录鉴权 
        //路由守卫：自定义路由组件，在路由组件里判断 token / 权限，用 Navigate 做重定向
    },
    {
        path: "/login",
        element: <RequireAuth allowed={false} redirectTo="/dashboard"> <Login /> </RequireAuth>
    },
    {
        path: "*",
        element: <NotFound /> //使用通配符放在最后进行兜底
    }
]