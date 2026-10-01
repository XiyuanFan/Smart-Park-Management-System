import { Card, Row, Col, Table, Input, Button, Pagination, Popconfirm, Tree } from "antd"
import { getAccountList } from "../../api/users";
import useDataList from "../../hooks/useDataList";
import type { TreeDataNode, TreeProps } from 'antd';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import withPermissions from "../../utils/withPermissions";
//菜单树节结构
interface MenuType {
    label: string;
    icon: string;
    key: string;
    children?: MenuType[]
}
//账号表格的数据类型
interface DataType {
    id: number;
    accountName: string;
    auth: string;
    person: string;
    tel: string;
    department: string;
}
//查询数据类型
interface SearchType {
    accountName: string
}

//整个系统菜单结构的静态版本
const treeData: TreeDataNode[] = [
    {
        title: '工作台',
        key: '/dashboard',
    },
    {
        title: '租户管理',
        key: '/users',
        children: [
            { title: '租户列表', key: '/users/list' },
            { title: '新增租户', key: '/users/add' },
        ],
    },
    {
        title: '物业管理',
        key: '/estate',
        children: [
            {
                title: "楼宇管理",
                key: "/estate/tenement"
            },
            {
                title: "房间管理",
                key: "/estate/room"
            },
            {
                title: "车辆信息",
                key: "/estate/car"
            }

        ]
    },
    {
        title: '报修管理',
        key: '/repair',
    },
    {
        title: '财务管理',
        key: '/finance',
        children: [
            {
                title: "合同管理",
                key: "/finance/contract"
            },
            {
                title: "合同详情",
                key: "/finance/surrender"
            },
            {
                title: "账单管理",
                key: "/finance/bill"
            }
        ]
    },
    {
        title: '招商管理',
        key: '/merchants',
    },
    {
        title: '运营管理',
        key: '/operation',
        children: [
            {
                title: "运营总览",
                key: "/operation/all"
            },
            {
                title: "文章发布",
                key: "/operation/article"
            },
            {
                title: "内容评论",
                key: "/operation/comments"
            }
        ]
    },
    {
        title: '设备管理',
        key: '/equipment',
    },
    {
        title: '能源消耗',
        key: '/energy',
    },
    {
        title: '系统设置',
        key: "/settings",
    },
    {
        title: '个人中心',
        key: "/personal",
    },
];

//从菜单树中提取所有 叶子节点的 key放入数组keys[]中
function extractTreeKeys(data: any) {
    let keys: string[] = [];
    data.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
            const childKeys: string[] = extractTreeKeys(item.children);
            keys = keys.concat(childKeys)
        } else {
            keys.push(item.key)
        }
    })
    return keys
}

function Settings() {
    //JSON.parse() 将 JSON 字符串解析为 对象或值
    //这个按钮只有拥有 delete 权限的人才能看到
    //把 Button 包装成一个有权限判断能力的新组件
    //React.FC 是 React.FunctionComponent 的别名，表示函数组件的类型。
    const AuthButton: React.FC<any> = withPermissions(['delete'], JSON.parse(sessionStorage.getItem("btnAuth") as string))(Button)

    //在点击“修改权限”按钮时触发
    const edit = (menu: MenuType[], accountName: string) => {
        //把左侧卡片标题改成当前账号名
        setAccountName(accountName);
        //提取当前这个账号已有的菜单权限 menu，提取出叶子节点 key
        const newCheckedKeys = extractTreeKeys(menu)
        // 让 Tree 左侧的复选框高亮这些权限
        setCheckedKeys(newCheckedKeys)
    }

    const columns = [
        {
            title: "No.",
            key: "index",
            render: (text: any, record: any, index: any) => index + 1,
        },
        {
            title: "账号名称",
            dataIndex: "accountName",
            key: "accountName",
        },
        {
            title: "所属权限",
            dataIndex: "auth",
            key: "auth",
        },
        {
            title: "使用人",
            dataIndex: "person",
            key: "person",
        },
        {
            title: "使用人电话",
            dataIndex: "tel",
            key: "tel",
        },
        {
            title: "所属部门",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "操作",
            key: "operate",
            render(value: string, record: any) {
                return <>
                    {/**点击修改权限按钮，把该账号的菜单树权限同步到左边 Tree */}
                    <Button size="small" type="primary" className="mr" onClick={() => edit(record.menu, record.accountName)}>修改权限</Button>
                    <Popconfirm
                        title="操作提示"
                        description="确认要删除当前账号吗？"
                        okText="是"
                        cancelText="否"
                    >
                        {/** 删除按钮通过 AuthButton 做权限控制，不是所有人都能看到 */}
                        <AuthButton size="small" type="primary" danger>删除账号</AuthButton>
                        {/* <Button size="small" type="primary" danger>删除账号</Button> */}
                    </Popconfirm>

                </>
            }
        }
    ]
    //当前操作账号名
    const [accountName, setAccountName] = useState<string>("当前用户")
    //当前登录用户的菜单树
    const { menuList } = useSelector((state: any) => state.authSlice)
    //当前树勾选项
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
    // 账号列表数据
    const { dataList, page, pageSize, total, loading, formData, onChange, handleChange } = useDataList<SearchType, DataType>({ accountName: "" }, getAccountList)

    //左侧树及勾选项一开始显示的是“当前登录用户的权限”。
    useEffect(() => {
        setCheckedKeys(extractTreeKeys(menuList))
        // 左侧权限树只在页面挂载时用「当前登录用户的菜单」初始化一次，
        // extractTreeKeys 未做 memo，加入依赖会造成重复执行。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //提交修改权限请求checkedKeys和accountName
    const handle = () => {
        console.log(checkedKeys, accountName)
    }
    // 用户在左侧 Tree 中勾选/取消勾选权限项时,更新本地 checkedKeys
    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        setCheckedKeys(checkedKeys as React.Key[])
    }
    return <div>
        <Card>
            <Row gutter={16}>
                <Col span={8}>
                    <Input name="accountName" value={formData.accountName} placeholder="请输入账户名" onChange={handleChange} />
                </Col>
                <Col span={8}>
                    <Button type="primary"> 搜索</Button>
                </Col>
                <Col span={8} className="tr">
                    <Button type="primary">新建账号</Button>
                </Col>
            </Row>

        </Card>

        <Row gutter={16} className="mt">
            <Col span={8} >
                <Card title={accountName + ":所拥权限"}>
                    {/**树组件 
                     * 支持勾选，勾选状态由 checkedKeys 控制 
                     * 修改勾选时更新当前树勾选项的本地状态*/}
                    <Tree
                        checkable
                        treeData={treeData}
                        checkedKeys={checkedKeys}
                        onCheck={onCheck}
                    />
                </Card>
                <Card className="mt">
                    <Popconfirm
                        title="操作提示"
                        description={`您确认要修改${accountName}用户的权限吗？}`}
                        okText="是"
                        cancelText="否"
                        onConfirm={handle}
                    >
                        <Button type="primary">提交修改</Button>
                    </Popconfirm>
                </Card>
            </Col>

            <Col span={16}>
                <Card>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={dataList}
                        rowKey={record => record.id}
                        pagination={false}
                    />
                    <Pagination className="fr mr" showQuickJumper total={total} current={page} pageSize={pageSize} onChange={onChange} />
                </Card>

            </Col>
        </Row>

    </div>
}



export default Settings