import React from "react";
import { Card, Row, Col, Input, Button, Table, Pagination, Tag, Popconfirm, message } from "antd"
import type { TableProps } from 'antd';
import { useState, useEffect, useMemo, useCallback } from "react";
import type { DataType } from "./interface";  //表格每一行的数据类型
import { getUserList } from "../../api/userList"; //获取用户列表请求
import type { PaginationProps } from 'antd';
import { deleteUser, batchDeleteUser } from "../../api/userList"; //单个删除和批量删除用户请求
import UserForm from "./userForm"; //弹窗表单组件
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userSlice";

interface searchType {
    companyName: string;
    contact: string;
    phone: string
}  //查询表达的数据结构

function Users() {
    const [dataList, setDataList] = useState<DataType[]>([]) //列表数据(元素为DataType类型的数组)
    const [page, setPage] = useState<number>(1); //当前页码
    const [pageSize, setPageSize] = useState<number>(10); //每页条数
    const [total, setTotal] = useState<number>(0) //数据总条数
    const [loading, setLoading] = useState<boolean>(false) //加载状态
    //多选状态；保存当前表格中勾选的行 id，用于批量删除。
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false) //弹窗控制状态(是否打开)
    const [title, setTitle] = useState<string>("") // 弹窗标题(新增还是编辑)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState<searchType>({
        companyName: "",
        contact: "",
        phone: ""
    }) //查询表单状态；保存查询条件输入值

    //控制“批量删除”按钮是否禁用
    const disabled = useMemo(() => {
        return selectedRowKeys.length ? false : true
    }, [selectedRowKeys]) //派生状态通过已有状态计算得出，不重复维护

    useEffect(() => {
        loadData()
        // loadData 未做 memo，加入依赖会导致无限请求；
        // 这里刻意只在分页变化时重新拉取（查询由「查询」按钮单独触发）。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]) //首次进入时加载数据；当页码变化时重新拉数据；当每页条数变化时重新拉数据

    //加载用户数据dataList
    const loadData = async () => {
        setLoading(true)
        //列表接口既依赖查询条件，也依赖分页信息。
        const { data: { list, total } } = await getUserList({ ...formData, page, pageSize });
        setLoading(false)
        setDataList(list)
        setTotal(total)
    }  

    //通用的表单输入处理函数，避免给每个输入框都单独写 onChange
    //e：事件对象，类型为 React.ChangeEvent<HTMLInputElement>，表示这是一个由 <input> 元素触发的变更事件。
    //TypeScript 类型注解确保只能将此类事件传递给函数。
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        //函数式更新，确保基于最新的状态进行修改，避免异步竞态问题
        setFormData(prevState => ({
            ...prevState, //将原表单对象的所有属性展开到新对象中
            [name]: value //根据输入框的name修改更新后的值
        }))
    }

    //为表格 rowSelection 属性的 onChange 回调
    //勾选表格行时，把选中的 key 列表存起来
    const onSelectChange = (selectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(selectedRowKeys)
    }
    //Ant Design 表格复选功能的标准接法
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    }
    //分页变化处理；更新分页状态(更新触发useEffect重新加载渲染列表)
    const onChange: PaginationProps['onChange'] = (page, pageSize) => {
        setPage(page)
        setPageSize(pageSize);
    }
    //重置功能；清空已选项；清空查询表单；重置页码和每页条数；重新加载数据
    const reset = () => {
        setSelectedRowKeys([]);
        setFormData({ companyName: "", contact: "", phone: "" })
        setPage(1)
        setPageSize(10);
        loadData()
    }
    //单个删除；提交id
    const confirm = async function (id: string) {
        const { data } = await deleteUser(id);
        message.success(data);
        loadData();

    }
    //批量删除；提交选中的id数组
    const batchDelete = async () => {
        const { data } = await batchDeleteUser(selectedRowKeys)
        message.success(data);
        loadData();
    }

    /**当前列表页不直接把表单值传给 UserForm，而是先把当前编辑的数据存入Redux，UserForm 再从 Redux 中读取 userData */
    /**弹窗组件和列表页解耦；编辑和新增共用一个弹窗组件；当前编辑数据可以单独管理 */
    //编辑
    const edit = (record: DataType) => {
        setIsModalOpen(true); //弹窗状态为打开
        setTitle("编辑企业"); //切换弹窗title
        dispatch(setUserData(record)) //传入被编辑这项的用户的信息
    }
    //新增
    const add = () => {
        setIsModalOpen(true);
        setTitle("新增企业");
        dispatch(setUserData({}))
    }

    //关闭用户表单弹窗的方法作为props（实现父子组件通信，子组件能够通知）
    //useCallback用于缓存函数，稳定函数引用，结合React.memo使用
    // React.memo 的作用是：如果传入子组件的 props 没变，就尽量不重新渲染子组件
    //函数类型的 props，如果每次渲染都创建新函数，即便函数内容没变，引用也变了，React 会认为 props 变了，所以要稳定函数引用
    const hideModal = useCallback(() => {
        setIsModalOpen(false)
    }, [])

    //表格列配置
    const columns: TableProps<DataType>['columns'] = [
        {
            title: "No.",
            key: "index",
            render(value, record, index) {
                return index + 1
            },
        },
        {
            title: "客户名称",
            key: "name",
            dataIndex: "name"
        }, //直接映射渲染
        {
            title: "经营状态",
            key: "status",
            dataIndex: "status",
            render(value) {
                // 接口返回的 status 是字符串，需显式转数字后再比较
                if (Number(value) === 1) {
                    return <Tag color="green">营业中</Tag>
                } else if (Number(value) === 2) {
                    return <Tag color="#f50">暂停营业</Tag>
                } else if (Number(value) === 3) {
                    return <Tag color="red">已关闭</Tag>
                }
            } //状态码映射渲染
        },
        {
            title: "联系电话",
            key: "tel",
            dataIndex: "tel",
        },
        {
            title: "所属行业",
            key: "business",
            dataIndex: "business"
        },
        {
            title: "邮箱",
            key: "email",
            dataIndex: "email"
        },
        {
            title: "统一信用代码",
            key: "creditCode",
            dataIndex: "creditCode"
        },
        {
            title: "工商注册号",
            key: "industryNum",
            dataIndex: "industryNum"
        },
        {
            title: "组织结构代码",
            key: "organizationCode",
            dataIndex: "organizationCode"
        },
        {
            title: "法人名",
            key: "legalPerson",
            dataIndex: "legalPerson"
        },
        {
            title: "操作",
            key: "operate",
            render(value, record, index) {
                return <>
                    <Button type="primary" size="small" onClick={() => edit(record)}>编辑</Button>
                    <Popconfirm
                        title="删除确认"
                        description="确定要删除吗？"
                        okText="是"
                        cancelText="否"
                        onConfirm={() => confirm(record.id)}
                    > {/**二次确认删除 */}
                        <Button type="primary" danger className="ml" size="small" >删除</Button>
                    </Popconfirm>

                </>
            },
        },
    ];
    return <div className="users">
        {/** props变化会重新渲染 */}
        <MyUserForm visible={isModalOpen} hideModal={hideModal} title={title} loadData={loadData} />
        {/**Card是一个卡片容器 */}
        <Card className="search">
            {/**Row 和 Col 是 Ant Design 的栅格布局*/}
            <Row gutter={16}>
                <Col span={7}> {/**Col表示一列 */}
                    <p>企业名称：</p>
                    <Input name="companyName" value={formData.companyName} onChange={handleChange} />
                </Col>
                <Col span={7}>
                    <p>联系人：</p>
                    <Input name="contact" value={formData.contact} onChange={handleChange} />
                </Col>
                <Col span={7}>
                    <p>联系电话:</p>
                    <Input name="phone" value={formData.phone} onChange={handleChange} />
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={loadData}>查询</Button>
                    <Button className="ml" onClick={reset}>重置</Button>
                </Col>
            </Row>
        </Card>
        {/** mt：margin-top，上边距；tr：text-right，右对齐 */}
        <Card className="mt tr">
            <Button type="primary" onClick={add}>新增企业</Button>
            <Button danger type="primary" className="ml" disabled={disabled} onClick={batchDelete}>批量删除</Button>
        </Card>
        <Card className="mt">
            <Table
                columns={columns}
                dataSource={dataList}   /** dataList数据来源 */
                rowKey={(record) => record.id}
                loading={loading}  //加载态
                //开启表格多选功能。每行前面会出现复选框；用户可以勾选多条数据；勾选结果会同步到 selectedRowKeys
                rowSelection={rowSelection}
                pagination={false} //关闭 Table 自带分页
            />
            <Pagination
                className="fr mt"
                total={total} 
                current={page} //当前页码
                pageSize={pageSize} //每页多少条数据
                showSizeChanger //允允许用户切换每页条数
                showQuickJumper //允许用户直接输入页码跳转
                showTotal={(total) => `共 ${total} 条`}
                //切页或切换pageSize时触发，更新page和pageSize，
                //然后 useEffect 监听这两个状态变化，再自动调用 loadData() 重新请求。
                onChange={onChange}  
            />
        </Card>
    </div>
}

const MyUserForm = React.memo(UserForm) //组件只在props变化时重新渲染
export default Users

/** 这个用户管理页的渲染层采用了典型的中后台列表页结构，页面由查询区、操作区、表格区和弹窗区组成。查询区通过受控输入框维护筛
  选条件，操作区承载新增和批量删除入口，表格区基于 Ant Design Table 展示数据并开启多选能力，分页器独立于表格控制服务端分
  页，弹窗组件则复用同一套表单完成新增和编辑场景。 */

/** ### 1. 为什么 loadData 没有像 hideModal 一样用 useCallback 包裹？
  答：因为 loadData 依赖 formData、page、pageSize 等变化状态，即使使用 useCallback 也必须把这些依赖写进去，所以函数引用仍然
  会频繁变化，稳定收益不像 hideModal 那么明显。  
  
  ### 3. React.memo 为什么会被函数 props 影响？
  答：因为 React.memo 默认做浅比较，函数比较的是引用地址。父组件每次渲染如果都创建新的函数对象，即使逻辑没变，子组件也会认
  为 props 变了，从而重新渲染。*/