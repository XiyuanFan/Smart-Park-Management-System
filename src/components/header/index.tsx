import React from 'react';
import { UserOutlined, PoweroffOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd'; //菜单类型约束
import { Dropdown, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../store/login/authSlice';
import { setMenu } from '../../store/login/authSlice';

//定义下拉菜单的两项
const items: MenuProps['items'] = [
  {
    key: '1',
    label: <span>个人中心</span>,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <span>退出登录</span>,
    icon: <PoweroffOutlined />,
  },

];
function MyHeader() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === "1") {
      //跳转到个人中心
      navigate("/personal")
    } else {
      dispatch(clearToken()); //把 Redux 中的 token 设为 null
      dispatch(setMenu([])) //清空菜单
      sessionStorage.clear() //删除 sessionStorage 中的 token
    }

  }
  return <div>
    {/** Dropdown表示顶部是一个下拉菜单  
       * 菜单项内容由 items 决定； 点击行为由 onClick 决定*/}
    <Dropdown menu={{ items, onClick }}>
      <span style={{ cursor: "pointer" }}> {/**下拉菜单的触发区域 */}
        <Space>
          欢迎您,{sessionStorage.getItem("username")}
          <DownOutlined />
        </Space>
      </span>
    </Dropdown>
  </div>
}

export default MyHeader

/** 是后台顶部栏组件，负责展示当前登录用户信息，并通过 Ant Design 的下拉菜单提供个人中心跳转
  和退出登录功能。退出时会清空 token、菜单和会话缓存，并依赖路由守卫自动回到登录页，完成登录态的销毁与权限回收。 */

/**  ### 1. 为什么退出登录后没有手动跳转，也会回到登录页？
  答：因为退出登录时清空了 Redux 中的 token，而主页面 / 是受路由守卫保护的。守卫检测到用户未登录后，会自动重定向到 /login。

  ### 2. 为什么退出登录除了清 token，还要清菜单？
  答：因为这个项目菜单是按用户权限动态生成的。如果只清 token 不清菜单，可能会残留上一个用户的菜单数据，造成权限展示不一致。 

  ### 6. 退出登录最核心的本质是什么？
  答：本质是销毁前端保存的认证状态，让系统重新回到“未登录”状态。只要鉴权判断基于 token，清除 token 就等于退出登录。 */

