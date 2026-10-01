
import { Layout, theme } from 'antd'; //引入 Ant Design 布局和主题能力
import { useState } from 'react';
import NavLeft from '../../components/navLeft';
import MyBreadCrumb from '../../components/breadCrumb';
import MyHeader from '../../components/header';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout; // Layout 是一个组件对象，里面挂着Header等子组件。
function Home() {
    const [collapsed, setCollapsed] = useState<boolean>(false); //控制左侧栏是否折叠的状态
    const {
        token: { colorBgContainer },
    } = theme.useToken();  //读取 Ant Design 5 的主题设计 token
    return <div className='home'>
        <Layout style={{ minHeight: '100vh' }}>  {/**页面最小高度撑满整个浏览器窗口 */}
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {/*** collapsible：开启可折叠功能
                 - collapsed={collapsed}：当前是否折叠由 React state 控制
                 - onCollapse：用户点击折叠按钮时更新状态*/}
                <NavLeft />
            </Sider>  {/** Sider 作为侧边栏, 侧边栏内部渲染 NavLeft*/}
            <Layout>
                <Header style={{ paddingRight: "20px", background: colorBgContainer, textAlign: "right" }}>
                    <MyHeader />
                </Header>
                <Content style={{ margin: '0 16px', height: "90vh", overflowY: "auto", overflowX: "hidden" }}>
                    {/**margin: '0 16px'：左右留边距
                 - height:"90vh"：内容区固定高度
                 - overflowY:"auto"：垂直超出可滚动
                 - overflowX:"hidden"：隐藏横向滚动条 */}
                    <MyBreadCrumb /> {/**展示面包屑路径 */}
                    <Outlet /> {/**显示子路由内容 */}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    </div>
}
export default Home

/**该组件为项目后台的主布局组件，基于 Ant Design 的 Layout 体系实现侧边栏、顶部栏、内容区和页脚结构，并通
  过 Outlet 作为子路由渲染出口，让所有业务页面复用同一套后台框架。 */

/** ### 1. Home 组件在这个项目中扮演什么角色？
  答：Home 是后台系统的主布局组件，不负责具体业务，而是负责渲染侧边栏、顶部栏、面包屑、内容区和页脚。具体业务页面通过子路由显
  示在 Outlet 中。

  ### 2. Outlet 的作用是什么？
  答：Outlet 是 React Router 提供的子路由占位组件。父路由匹配成功后，当前子路由对应的页面组件会渲染到 Outlet 的位置。

  ### 3. 为什么后台项目通常要单独写一个布局组件？
  答：因为中后台项目大多数页面共享同样的导航、头部和内容框架。把公共布局抽成独立组件可以提升复用性，避免每个业务页面重复写相同
  结构，也更利于维护和扩展。

  ### 4. Sider 的折叠状态为什么用 useState 管理？
  答：因为折叠状态属于组件内部的 UI 交互状态，不需要放到 Redux 这类全局状态中。用局部 useState 管理更简单，也更符合状态归属原
  则。

  ### 5. theme.useToken() 是做什么的？
  答：它是 Ant Design 5 提供的主题 token 获取方式，用来读取当前主题下的设计变量，比如背景色、圆角、间距等，便于组件样式和主题
  系统保持一致。

  ### 6. 为什么内容区要单独设置 overflowY: auto？
  答：这样可以让主内容区域独立滚动，而不是整个页面一起滚动。对于中后台页面来说，这种布局方式更稳定，也能避免头部和侧边栏跟随滚
  动影响体验。

  ### 7. 这个布局组件和动态路由是什么关系？
  答：动态路由生成后，业务页面会作为 Home 的子路由挂载到 / 路由下面。Home 本身负责提供布局壳子，动态子路由则通过 Outlet 渲染到
  内容区。*/





