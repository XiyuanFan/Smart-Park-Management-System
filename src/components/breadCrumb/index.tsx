import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux";
import { Breadcrumb } from 'antd';
interface MenuItem{
    key:string;
    label:string;
    children?:MenuItem[]
} //菜单树节点结构


//[{label:"物业管理"},{label:"楼宇管理"}] ["物业管理","楼宇管理"]
function findBreadCrumbPath(path:string,menuItems:MenuItem[]):string[] {
    const pathSegments:string[]=[];  //用来存放最终找到的面包屑文字路径。

    //递归函数，负责在某一级菜单里查找当前路径对应的菜单项
    function findPath(currentPath:string,items:MenuItem[]){
        for(let item of items){
            if(currentPath.startsWith(item.key)){
                pathSegments.push(item.label)
                if(item.children){
                    findPath(currentPath,item.children)
                }
                break;
            }
        }
      
        return pathSegments
    }
    return  findPath(path,menuItems)
}

//面包屑组件
function MyBreadCrumb(){
    const location=useLocation(); 
    const {menuList}=useSelector((state:any)=>state.authSlice) 
    //计算面包屑数组，之后转换成 Ant Design 所需格式
    const breadList=findBreadCrumbPath(location.pathname,menuList).map(item=>({title:item}))
    return <Breadcrumb items={breadList} className="mt mb"/>
} 
export default MyBreadCrumb

/**该组件是后台面包屑组件，负责根据当前路由路径和 Redux 中保存的菜单树递归查找页面所属层级，
  并将结果转换为 Ant Design Breadcrumb 所需格式，从而实现与动态菜单、动态路由一致的面包屑展示。 */

/**### 1. 这个面包屑为什么不直接写死？
  答：因为项目菜单是动态的，不同角色用户看到的页面层级不同。如果写死面包屑，会导致维护成本高且无法适配权限变化。通过菜单树动态
  生成面包屑，可以保证它始终和当前权限菜单一致。

  ### 2. findBreadCrumbPath 的核心思路是什么？
  答：核心思路是基于当前路径在菜单树中做递归查找。每当匹配到当前路径所属菜单节点时，就把该节点的 label 加入结果数组，并继续向
  子节点查找，最终形成完整的层级路径。

  ### 3. 为什么这里用递归？
  答：因为菜单本身是树结构，父菜单下面可能还有多级子菜单。递归天然适合处理这种层级嵌套数据，可以逐层向下查找目标路径。

  ### 4. startsWith 在这里起什么作用？
  答：它用于判断当前页面路径是否属于某个菜单分支。例如 /users/list 以 /users 开头，就说明当前页面属于“用户管理”这一层，再继续
  去子菜单中查找更具体的节点。

  ### 5. 为什么面包屑要从 Redux 的 menuList 中计算？
  答：因为 menuList 是当前用户真实可见的权限菜单数据。基于这份数据计算面包屑，可以保证面包屑展示和左侧菜单、动态路由保持一致。

  ### 6. 面包屑和动态路由的共同点是什么？
  答：它们都依赖同一份菜单树数据。动态路由决定页面能不能访问，左侧菜单决定页面怎么展示，面包屑决定当前页面处于哪个层级，本质上
  都是菜单树的不同使用方式。 */