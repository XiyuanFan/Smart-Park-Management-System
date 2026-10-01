import {Card,Table,Row,Col,Input,Button, Tag,Pagination} from "antd"
import { useEffect, useState } from "react"
import { TableProps } from "antd";
import { getContractList } from "../../api/contract";
import { setData,setTotal,setCurrent,setFormList,setSize } from "../../store/finance/contractSlice";
import { useDispatch,useSelector } from "react-redux";
import { PaginationProps } from "antd";
import { useNavigate,useSearchParams } from "react-router-dom";

//查询条件类型
interface SearchType{
    contractNo:string;
    person:string;
    tel:string
}

//表格数据类型
interface DataType{
    key:string;
    contractNo:string;
    type:string;
    name:string;
    startDate:string;
    endDate:string;
    jia:string;
    yi:string;
    status:string
}

function Dashboard(){
    //获取store中contractSlice的数据
    const {data,total,formList,size,current}=useSelector((state:any)=>state.contractSlice)
    const [formData,setFormData]=useState<SearchType>({
        contractNo:"",
        person:"",
        tel:""
    })
    const [loading,setLoading]=useState<boolean>(false)
    const [page,setPage]=useState<number>(1)
    const [pageSize,setPageSize]=useState<number>(10)

    /**  读取当前 URL 上是否有 return=true;如果有，说明用户是从详情页返回来的;如果没有，说明是正常首次进入列表页*/
    /** 正常进入：/finance/contract; 从详情返回：/finance/contract?return=true */
    /**这样页面就能根据来源决定：是重新请求数据, 还是恢复原来状态 */
    const [searchParams]=useSearchParams();
    const isReturn=searchParams.get("return")

    const dispatch=useDispatch()
    const navigate=useNavigate()
    
    /**随着输入更新查询表单数据 */
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData(prevState=>({
            ...prevState,
            [name]:value
        }))
        /** 把最新查询表单输入框的数据同步到 Redux ，做跨页面状态保存
         * 用户每输入一个查询条件，Redux 里的缓存查询条件也同步更新
        这样即使跳转到详情页再回来，输入框内容也能恢复*/
        dispatch(setFormList({
            ...formData,
            [name]:value
        }))
    }

    /**分页切换时也要写 Redux ：分页状态缓存，从详情返回时能恢复分页状态*/
    const onChange:PaginationProps["onChange"]=(page,pageSize)=>{
        setPage(page)
        setPageSize(pageSize);
        dispatch(setCurrent(page))
        dispatch(setSize(pageSize))
        loadData(page,pageSize)
    }

    const loadData=async(page:number,pageSize:number)=>{
       setLoading(true)
       const {data:{list,total}}= await getContractList({...formData,page,pageSize});
       setLoading(false)
       //把列表数据list和总数total写入 Redux
       dispatch(setData(list))
       dispatch(setTotal(total))
    }
    //进入合同详情页（带查询参数ontractNo）
    const detail=(contractNo:string)=>{
        navigate("/finance/surrender?contractNo="+contractNo)
    }
    const reset=()=>{
        setFormData({ contractNo:"",person:"",tel:""})
        setPage(1);
        setPageSize(10);
        loadData(1,10)
    }

    //进行页面初始化副作用
    //渲染完成后，再执行 useEffect
    useEffect(()=>{
        if( !isReturn || !data.length){
            loadData(page,pageSize)
        }
        //详情页返回恢复 Redux 中的旧状态
        if(isReturn){
            setFormData(formList);
            setPage(current)
            setPageSize(size)
        }
    },[])

    const columns:TableProps<DataType>["columns"]=[
        {
            title:"No.",
            key:"index",
            render(value,record,index){
                return index+1
            }
        },
        {
            title:"合同编号",
            dataIndex:"contractNo",
            key:"contractNo"
        },
        {
            title:"合同类别",
            dataIndex:"type",
            key:"type"
        },
        {
            title:"合同名称",
            dataIndex:"name",
            key:"name"
        },
        {
            title:"合同开始日期",
            dataIndex:"startDate",
            key:"startDate"
        },
        {
            title:"合同结束如期",
            dataIndex:"endDate",
            key:"endDate"
        },
        {
            title:"甲方",
            dataIndex:"jia",
            key:"jia"
        },
        {
            title:"乙方",
            dataIndex:"yi",
            key:"yi"
        },
        {
            title:"审批状态",
            dataIndex:"status",
            key:"status",
            render(value){
                if(value==1){
                  return  <Tag>未审批</Tag>
                }else if(value==2){
                    return <Tag color="green">审批通过</Tag>
                }else{
                    return <Tag color="red">审批拒绝</Tag>
                }
            }
        },
        {
            title:"操作",
            key:"operate",
            render(value,record){
                return <Button type="primary" size="small" onClick={()=>detail(record.contractNo)}>合同详情</Button>
            }
        },
    ]
    return <div>
        <Card className="search">
            <Row gutter={16}>
                <Col span={7}>
                    <p>合同编号：</p>
                    <Input name="contractNo" value={formData.contractNo} onChange={handleChange}/>
                </Col>
                <Col span={7}>
                    <p>联系人：</p>
                    <Input name="person" value={formData.person} onChange={handleChange}/>
                </Col>
                <Col span={7}>
                    <p>联系电话：</p>
                    <Input name="tel" value={formData.tel} onChange={handleChange}/>
                </Col>
                <Col span={3}>
                    <Button type="primary" className="mr" onClick={()=>loadData(page,pageSize)}>查询</Button>
                    <Button onClick={reset}>重置</Button>
                </Col>
            </Row>
        </Card>
        <Card className="mt">
            <Table
               columns={columns}
               pagination={false}
               loading={loading}
               dataSource={data} //从store中取数据
               rowKey={(record)=>record.contractNo}
            />
            <Pagination className="mt fr" showQuickJumper defaultCurrent={1} total={total} onChange={onChange} current={page} pageSize={pageSize}/>
        </Card>
    </div>
}

export default Dashboard