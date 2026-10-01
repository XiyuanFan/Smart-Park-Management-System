import { Menu } from 'antd';
import { useState, useEffect } from 'react';
import logo from "../../assets/logo.png"
import icons from './iconList';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

import "./index.scss"
interface MenuItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    children?: MenuItem[]
}

interface MenuItemFromData {
    key: string;
    label: string;
    icon: string;
    children?: MenuItemFromData[]
}
function NavLeft() {
    const { menuList } = useSelector((state: any) => state.authSlice); //获取菜单树
    const navigate = useNavigate()
    const [menuData, setMenuData] = useState<MenuItem[]>([]); //渲染用的菜单
    const location = useLocation(); //获得当前路径，控制高亮
    // const selectedKey=location.pathname
    useEffect(() => {
        configMenu()
        // configMenu 内部只用到 menuList，但它没有用 useCallback 包裹；
        // 若把它放进依赖数组，每次渲染都会重建菜单。故只保留 menuList。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuList]); // menuList 变化时，重新生成左侧菜单（登录成功后菜单是异步获取的）
    async function configMenu() {
        const mappedMenuItems: MenuItem[] = mapMenuItems(menuList);
        setMenuData(mappedMenuItems); //更改菜单状态menuData
    }

    //将返回的菜单数据menuList转换成Ant Design Menu需要的格式；递归支持多级菜单
    function mapMenuItems(items: MenuItemFromData[]): any {
        return items.map((item: MenuItemFromData) => ({
            key: item.key,
            label: item.label,
            icon: icons[item.icon],
            children: item.children ? mapMenuItems(item.children) : null //递归操作
        }))
    }
    //Ant Design Menu 点击后会把当前点击项的 key 传过来。
    //而这个项目把菜单 key 设计成了“路由路径”，可以通过key跳转
    function handleClick({ key }: { key: string }) {
        navigate(key)
    }

    return <div className='navleft'>
        <div className='logo'>
            <img src={logo} alt="" width={18} />
            <h1>朋远智慧园区</h1>
        </div>

        <Menu
            defaultSelectedKeys={['/dashboard']}
            mode="inline"
            theme="dark"
            items={menuData} //把前面递归转换后的菜单数组交给 Ant Design 渲染。
            onClick={handleClick} //处理点击跳转
            selectedKeys={[location.pathname]} //根据当前 URL 路径，高亮当前菜单项。
        />
    </div>
}
export default NavLeft

/** src/components/navLeft/index.tsx 是后台左侧导航组件，负责从 Redux 中读取当前用户菜单树，通过递归方式将接口菜单数据映射为
  Ant Design Menu 组件所需结构，并结合 location.pathname 实现菜单高亮与路由联动，最终完成动态导航渲染与页面跳转。 */

/** ### 1. 左侧菜单为什么不直接写死？
  答：因为这个项目采用的是基于角色的动态菜单方案，不同用户登录后看到的菜单不同。如果写死菜单，就无法和后端下发的权限菜单保持一
  致，也不利于权限控制和系统扩展。

  ### 2. 为什么要把接口返回的菜单数据再做一次转换？
  答：因为接口返回的数据结构和 Ant Design Menu 组件需要的 items 结构并不完全一致，尤其图标字段是字符串而不是 React 节点，所以
  需要做一次映射转换。

  ### 3. 为什么 mapMenuItems 要用递归？
  答：因为菜单是树形结构，可能包含多级子菜单。如果只做一层遍历，子菜单无法完整转换，所以需要递归处理整个菜单树。

  ### 4. 为什么菜单点击时可以直接 navigate(key)？
  答：因为这个项目把菜单项的 key 直接设计成路由路径，点击菜单时拿到的 key 本身就是目标页面地址，所以可以直接作为 navigate 的参
  数。

  ### 5. selectedKeys={[location.pathname]} 的作用是什么？
  答：它让当前菜单高亮状态由路由地址驱动，而不是依赖手动维护状态。这样无论是点击跳转、刷新页面还是浏览器前进后退，菜单高亮都能
  和当前页面保持一致。

  ### 6. 这个组件为什么同时用了 Redux 和 React 本地 state？
  答：Redux 用来存全局菜单数据 menuList，因为多个组件都可能依赖它；本地 state menuData 用来存转换后的渲染结构，属于当前组件内
  部展示状态，两者职责不同。

  ### 7. 图标字符串映射成组件这种做法有什么意义？
  答：因为后端一般不能直接返回 React 组件，只能返回字符串标识。前端通过映射表把字符串转换成实际图标组件，就能在保持接口数据纯
  净的前提下实现动态图标渲染。 */