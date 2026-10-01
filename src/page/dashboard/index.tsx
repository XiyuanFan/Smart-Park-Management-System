/** - 使用了多个 Ant Design 展示组件
  - 集成了 ECharts 折线图、柱状图、玫瑰图
  - 动态图表接入了接口数据
  - 做了接口数据到图表配置的转换
  - 仪表盘布局比较完整，具备中后台首页特征 */

import { Row, Col, Card, Progress, Statistic, Timeline, Tag } from "antd"
import { RadarChartOutlined, SnippetsOutlined, DollarOutlined, LaptopOutlined } from "@ant-design/icons"
import ReactECharts from "echarts-for-react"
import { getEnergyData } from "../../api/dashboard"
import { useEffect, useState } from "react"
import "./index.scss"

//option2和option3们的数据是写死的，不依赖异步接口，是静态图表配置项
const option2 = {
    title: {
        text: '企业资质情况(家)'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: [0, 0.01],
        data: ['2014', '2016', '2018', '2020', '2022', "2024"]
    },
    yAxis: {
        type: 'value',

    },
    series: [
        {
            name: '科技企业',
            type: 'bar',
            data: [40, 220, 378, 658, 1122, 1200]
        },
        {
            name: '高新企业',
            type: 'bar',
            data: [20, 39, 443, 490, 559, 762]
        },
        {
            name: '国营企业',
            type: 'bar',
            data: [78, 167, 229, 330, 380, 420]
        }
    ]
};
const option3 = {
    legend: {
        top: '10px'
    },
    series: [
        {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [30, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            data: [
                { value: 40, name: '在营' },
                { value: 38, name: '已租' },
                { value: 32, name: '出租' },
                { value: 30, name: '续签' },
                { value: 28, name: '新签' },
                { value: 26, name: '待租' },
                { value: 22, name: '退租' },
            ]
        }
    ]
};
function Dashboard() {
    //动态折线图的初始配置
    const initalOption = {
        title: {
            text: '当日能源消耗'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        grid: {
            left: '%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        //图表工具栏支持“保存为图片”
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0：00', '4：00', '8：00', '12：00', '16：00', '20：00', '24：00']
        },
        yAxis: {
            type: 'value'
        },
        series: [] //数据先空着，靠接口数据填充
    };
    const [data, setData] = useState(initalOption) //data是要渲染的完整图表配置对象option
    useEffect(() => {
        const loadData = async () => {
            const { data: apiData } = await getEnergyData();
            // 前端把后端返回的数据结构，转换为图表库所要求的数据结构
            const dataList = apiData.map((item: any) => ({
                name: item.name,
                data: item.data,
                type: "line",
                stack: "Total"
            }));
            //补全 legend 和 series
            const updataOption = {
                ...data,
                legend: {
                    data: dataList.map((item: any) => item.name),
                },
                series: dataList
            }
            setData(updataOption)
        }
        loadData()
        // 图表 option 只在挂载时构建一次。data 是 option 的初始值，
        // 若加入依赖会形成「构建 option → setData → 再次构建」的循环。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="dashboard">
        <Row gutter={16}>
            <Col span={6}>
                <Card className="clearfix">
                    <div className="fl area">
                        <h2>13479</h2>
                        <p>园区总面积(平方米)</p>
                    </div>
                    <div className="fr">
                        <RadarChartOutlined className="icon" />
                    </div>
                </Card>
            </Col>
            <Col span={6}>
                <Card className="clearfix">
                    <div className="fl area">
                        <h2>8635</h2>
                        <p>总租赁面积(平方米)</p>
                    </div>
                    <div className="fr">
                        <SnippetsOutlined className="icon" style={{ color: "#81c452" }} />
                    </div>
                </Card>
            </Col>
            <Col span={6}>
                <Card className="clearfix">
                    <div className="fl area">
                        <h2>38764</h2>
                        <p>园区总产值(万元)</p>
                    </div>
                    <div className="fr">
                        <DollarOutlined className="icon" style={{ color: "#62c9cb" }} />
                    </div>
                </Card>
            </Col>
            <Col span={6}>
                <Card className="clearfix">
                    <div className="fl area">
                        <h2>2874</h2>
                        <p>入驻企业总数(家)</p>
                    </div>
                    <div className="fr">
                        <LaptopOutlined className="icon" style={{ color: "#e49362" }} />
                    </div>
                </Card>
            </Col>
        </Row>
        <Row gutter={16} className="mt">
            <Col span={12}>
                <Card title="能源消耗情况">
                    <ReactECharts option={data}></ReactECharts>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="企业资质情况">
                    <ReactECharts option={option2}></ReactECharts>
                </Card>
            </Col>
        </Row>
        <Row gutter={16} className="mt">
            <Col span={12}>
                <Card title="租赁情况">
                    <ReactECharts option={option3}></ReactECharts>
                </Card>
            </Col>
            <Col span={6}>
                <Card title="充电桩空闲统计">
                    <div className="wrap">
                        <Progress type="circle" percent={75} />
                        <Statistic title="总充电桩数" value={75} suffix="/ 100" className="mt" />
                    </div>

                </Card>
            </Col>
            <Col span={6}>
                <Card title="实时车辆信息" style={{ height: "406px" }}>
                    <Timeline items={[
                        {
                            children: <><Tag color="green">进场</Tag>08:24车辆 京A66666</>
                        },
                        {
                            children: <><Tag color="red">出场</Tag>09:15 车辆 京A66666  </>,
                            color: 'red',
                        },
                        {
                            children: <><Tag color="green">进场</Tag>09:22 车辆 京A23456  </>,
                        },
                        {
                            children: <><Tag color="red">出场</Tag>10:43 车辆 京A18763  </>,
                            color: 'red',
                        },
                        {
                            children: <><Tag color="green">进场</Tag>13:38 车辆 京A88888  </>,
                        },
                        {
                            children: <><Tag color="green">进场</Tag>14:46 车辆 京A23456  </>,

                        },
                    ]} />

                </Card>
            </Col>
        </Row>
    </div>
}

export default Dashboard

/** ### 1. 为什么这个页面把部分图表配置写成常量，部分放进 state？
  答：因为静态图表数据不会变化，写成常量即可；而能耗折线图依赖异步接口返回的数据，所以需要先有初始配置，再通过 state 更新图
  表 option。

  ### 2. ReactECharts 接收的 option 本质上是什么？
  答：option 是 ECharts 的完整图表配置对象，包含标题、图例、坐标轴、tooltip、series 等信息，是图表最终渲染的核心输入。

  ### 3. 接口数据为什么不能直接拿来画图，还要 map 一次？
  答：因为后端返回的是业务数据结构，而 ECharts 需要的是特定格式的 series 配置。前端需要做一次数据转换，把接口返回值映射成图
  表可识别的数据结构。

  ### 4. legend.data 为什么要从 series 名称里提取？
  答：因为图例需要知道每条数据系列的名称，用来在图表中展示分类说明和切换控制，所以通常会根据 series.name 动态生成。

  ### 6. useEffect(() => { loadData() }, []) 适合什么场景？
  答：适合页面首次挂载时拉取初始化数据的场景，比如 dashboard 首页、详情页初始加载等。空依赖数组表示只在初次渲染时执行一次。 */