import { RouterProvider } from "react-router-dom";
import { routes } from "./router";
import { useEffect, useState, Suspense } from "react";
import { generateRoutes } from "./utils/generatesRoutes";
import { Spin } from "antd";
import { createBrowserRouter } from "react-router-dom";
import { getMenu } from "./api/users";
import { useDispatch } from 'react-redux';
import { setMenu } from "./store/login/authSlice";
import { useSelector } from "react-redux";
function App() {
  console.log(process.env.REACT_APP_API_URL)
  const { token } = useSelector((state: any) => state.authSlice);
  const [routerss, setRouter] = useState<any>(null); //菜单请求完，setRouter(router)才生成动态路由
  const dispatch = useDispatch();

  //拉取菜单并生成动态路由
  useEffect(() => {
    async function loadData() {
      // 没有 token 时不该请求菜单（后端会返回 401），直接用基础路由渲染登录页
      if (!token) {
        setRouter(createBrowserRouter(routes));
        return;
      }

      const { data } = await getMenu(); // 第一步：请求菜单接口 根据权限获取菜单
      /**
       *  1. App.tsx 调用 getMenu()
          2. getMenu() 调用通用 get("/menu")
          3. get("/menu") 调用 axios 实例 http.get(...)
          4. axios 自动拼接基础地址，变成 https://www.demo.com/menu
          5. 请求发送时自动带上 token
          6. Mock.js 拦截这个请求
          7. Mock 根据 token 返回对应角色的菜单树
          8. 响应拦截器统一处理结果
          9. 最终把返回结果里的 data 解构出来，交给 App.tsx 去生成动态路由
       */
      if (data.length) {
        dispatch(setMenu(data)) //保存菜单树到store(authSlice.menuList)
        const routers = generateRoutes(data) //动态创建的路由表；把菜单树转换成路由数组
        const myRoutes = [...routes]; 
        myRoutes[0].children = routers; //所有业务页面都作为Home的子路由出现，
        myRoutes[0].children[0].index = true; //把第一个子路由设成默认首页
        const router = createBrowserRouter(myRoutes)  //创建路由器实例
        setRouter(router); //存入state
      } else {
        const router = createBrowserRouter(routes)
        setRouter(router);
      }
    }
    loadData().catch(() => {
      // 401/网络异常已由 axios 响应拦截器统一处理，这里只做兜底，
      // 避免出现未捕获的 Promise rejection。
    })
  }, [token])
  //useEffect的第二个参数：依赖数组，决定副作用函数何时执行(初次渲染和改变时执行一次)；这里的依赖数组token是用来判断当前登录态
  //token决定当前身份，当前身份决定菜单，菜单决定可访问页面，页面路由在运行时动态生成

  if (routerss) {
    return (
      <div className="App">
        {/* 加载路由配置，使用 Suspense 处理懒加载, 显示loding状态，这里用的是Ant Design的Spin*/}
        <Suspense fallback={<Spin></Spin>}> 
          <RouterProvider router={routerss}></RouterProvider>
        </Suspense>
      </div>
    ); 
  } else {
    return <Spin></Spin>
  }  // routerss状态不为空才开始加载


}

export default App;

/**
 *  ### 1. App.tsx 在这个项目里主要负责什么？
  答：App.tsx 是项目运行时的核心入口，主要负责读取登录态、请求菜单数据、根据菜单递归生成动态路由、创建 router 实例，
  并通过 RouterProvider渲染整个路由系统。

  ### 2. 为什么动态路由要在 App.tsx 里生成，而不是直接写死？
  答：因为这个项目的菜单和权限是和用户身份绑定的，不同角色登录后看到的菜单不同，可访问页面也不同。把动态路由生成放在 App.tsx，
  可以在应用初始化时根据当前用户菜单动态创建路由，避免维护多套路由表。

  ### 3. useEffect 为什么依赖 token？
  答：因为菜单和权限与登录状态有关。token 变化通常意味着登录、退出或身份变化，此时需要重新获取菜单并重建路由，
  确保当前路由系统和用户权限一致。

  ### 4. 为什么要先请求菜单，再创建 router？
  答：因为这个项目的业务页面路由不是固定的，而是由菜单数据驱动生成的。只有菜单数据拿到以后，才能知道当前用户有哪些页面权限，
  进而创建完整的路由实例。

  ### 5. RouterProvider 是做什么的？
  答：RouterProvider 是 React Router v6 数据路由体系中的顶层提供者，用来接收 createBrowserRouter 创建出的 router 实例，
  并让整个应用按照这套路由规则运行。

  ### 6. Suspense 在这里的作用是什么？
  答：因为页面组件是通过 React.lazy 懒加载的，所以在组件资源未加载完成前，需要 Suspense 提供一个 fallback UI，
  这里用的是 Ant Design 的 Spin作为加载占位。

  ### 7. 为什么 routerss 初始值是 null？
  答：因为路由实例依赖异步菜单数据，初始化时还没有办法立即创建 router，所以先用 null 占位，等菜单加载并路由生成完成后再更新 state。
 */