//这是一个高阶组件，用来做按钮权限
//你所拥有的权限 当前按钮所需要的权限  
//withPermissions 返回类型是一个函数，函数的参数类型和返回类型都是react组件
//requiredPermissions 当前按钮需要的权限
//userPermissions 当前用户拥有的权限
function withPermissions(requiredPermissions: string[], userPermissions: string[]): (Componet: React.FC) => React.FC {
    //参数是组件类型
    return function (Component: React.FC) {
        return function (props: any): React.ReactElement | null {
            //只有当 requiredPermissions 里的每一项都在 userPermissions 中，才算有权限                
            const hasPermission: boolean = requiredPermissions.every(item => userPermissions.includes(item));
            if (!hasPermission) {
                return null
            }
            //渲染传入的原组件
            return <Component {...props} />
        }
    }
}

export default withPermissions