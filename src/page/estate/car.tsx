import { Card, Row, Col, Table, Input, Button, Tabs, Image } from "antd"
import type { TabsProps, TableProps } from 'antd';
import come from "../../assets/come.jpg"
interface DataType {
    key: string;
    orderNo: string;
    date: string;
    carNo: string;
    type: string;
    startDate: string;
    time: string;
    count: string;
    cost: string;
}
interface DataType2 {
    key: string;
    carNo: string;
    name: string;
    tel: string;
    type: string;
    rest: string;
    time: string;
    pic: string;
}
const columns: TableProps<DataType>['columns'] = [
    {
        title: "No.",
        key: "index",
        render: (text, record, index) => index + 1,
    },
    {
        title: '订单编号',
        dataIndex: 'orderNo',
        key: 'orderNo',

    },
    {
        title: '订单日期',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '车牌号码',
        dataIndex: 'carNo',
        key: 'carNo',
    },
    {
        title: '车辆类型',
        dataIndex: 'type',
        key: 'type',

    },
    {
        title: '充电开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
    },
    {
        title: '充电时长',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: '充电量',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: '充电费用',
        dataIndex: 'cost',
        key: 'cost',
    },
    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
            return <>
                <Button type="primary" size="small">查看</Button>
            </>
        }
    },

];

const data: DataType[] = [
    {
        key: '1',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '2',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '3',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '4',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '5',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '6',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '7',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },
    {
        key: '8',
        orderNo: 'CD9872380',
        date: "2024-02-13",
        carNo: '京A88888',
        type: "自有车辆",
        startDate: "2024-02-13 15:33:12",
        time: "2小时25分钟",
        count: "30kw",
        cost: "¥40.50"
    },

];

const columns2: TableProps<DataType2>['columns'] = [
    {
        title: "No.",
        key: "index",
        render: (text, record, index) => index + 1,
    },
    {
        title: '车牌号',
        dataIndex: 'carNo',
        key: 'carNo',

    },
    {
        title: '车主姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '车主电话',
        dataIndex: 'tel',
        key: 'tel',
    },
    {
        title: '租赁类型',
        dataIndex: 'type',
        key: 'type',

    },
    {
        title: '租期剩余',
        dataIndex: 'rest',
        key: 'rest',
    },
    {
        title: '超期天数',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: '入场照片',
        dataIndex: 'pic',
        key: 'pic',
        render: (text) => <Image
            src={come}
            width={50}
            //placeholder 设置了一个更大的预加载图
            placeholder={
                <Image
                    preview={false}
                    src={come}
                    width={150}
                />
            }
        />
    },

    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
            return <>
                <Button type="primary" size="small" className='mr'>编辑</Button>
                <Button type="primary" size="small" danger>删除</Button>
            </>
        }
    },

];
const data2: DataType2[] = [
    {
        key: '1',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '2',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '3',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '4',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '5',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '6',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '7',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },
    {
        key: '8',
        carNo: '京A88888',
        name: "王丽",
        tel: "18876543210",
        type: '长租车',
        rest: "135天",
        time: "0天",
        pic: "",
    },

];

//Ant Design Tabs 的标准配置式写法; 把两个表格装进 Tabs
const items: TabsProps['items'] = [
    {
        key: "1",
        label: "充电记录",
        children: <Table columns={columns} dataSource={data} />
    },
    {
        key: "2",
        label: "园内车辆列表",
        children: <Table columns={columns2} dataSource={data2} />
    }
]

function Car() {
    return <div>
        <Card>
            <Row gutter={16}>
                <Col span={8}>
                    <Input placeholder="请输入车牌号、手机号或者联系人" />
                </Col>
                <Col span={8}>
                    <Button type="primary" className="ml">查询</Button>
                </Col>
            </Row>
        </Card>
        <Card className="mt">
            <Tabs items={items}></Tabs>
        </Card>
    </div>
}

export default Car

/**  ### 1. 前端搜索一般有哪两种实现方式？
  答：本地过滤和服务端搜索。本地过滤适合数据量小、数据已全部加载的场景；服务端搜索适合数据量大、需要结合分页和权限控制
  的中后台场景。

  ### 2. 为什么中后台更常用“点击按钮再搜索”而不是输入即搜索？
  答：因为中后台筛选条件通常较多，且搜索往往伴随分页和接口请求。点击按钮再查询可以减少无效请求，也更符合业务操作习惯。

  ### 3. useMemo 适合做搜索过滤吗？
  答：适合。对于本地静态数据过滤，useMemo 可以基于关键字和原始数据计算过滤结果，避免每次渲染都重复执行过滤逻辑。

  ### 4. 什么时候不该用前端本地过滤？
  答：当数据量大、需要精确查询、需要权限控制、需要后端参与排序/分页时，不适合本地过滤，应该交给后端搜索接口处理。 
  
   ### 1. 请求参数里的 page 和 pageSize 分别表示什么？
  答：page 表示当前请求第几页数据，pageSize 表示每页返回多少条数据。两者通常一起用于服务端分页查询。

  ### 2. 后端分页一般怎么计算当前页数据范围？
  答：通常通过公式 start = (page - 1) * pageSize 计算起始位置，再取 pageSize 条数据。例如第 2 页每页 10 条，就从第 11 条开
  始取 10 条。

  ### 3. 为什么后端除了返回 list 还要返回 total？
  答：因为前端分页器不仅要展示当前页数据，还要知道总共有多少条记录，才能计算总页数、渲染页码和显示“共多少条”文案。

  ### 4. 服务端分页和前端分页的区别是什么？
  答：前端分页是一次性拿全量数据，在前端切片；服务端分页是每次请求只拿当前页数据，由后端负责过滤和切片。大数据量场景通常使
  用服务端分页。

  ### 5. 为什么中后台列表大多使用服务端分页？
  答：因为中后台数据量通常较大，还伴随搜索、排序、权限控制和实时更新需求。服务端分页可以减少传输压力，并充分利用数据库查询
  能力。*/