import { Card, Row, Col, Image, Radio, Spin } from "antd"
import { useEffect, useState } from "react"
import { getRoomList } from "../../api/room"
import "./index.scss"
import { RadioChangeEvent } from "antd/lib";
import roomPic from "../../assets/roomPic.jpg"
interface RoomType {
    roomNumber: number;
    decorationType: "毛坯" | "精装";
    area: number;
    unitPrice: number;
    src: string
}
function Room() {
    const [visible, setVisible] = useState<boolean>(false)
    const [room, setRoom] = useState<RoomType[]>([])
    //户型图默认是一张本地图片，但真正点击房间时，会被接口返回的 item.src 替换掉
    const [src, setSrc] = useState<string>(roomPic);
    const [loading, setLoading] = useState<boolean>(false)
    //加载房间列表
    const loadRoom = async (roomid: string) => {
        setLoading(true)
        const { data: { rooms } } = await getRoomList(roomid);
        setLoading(false)
        setRoom(rooms)
    }
    //处理切换按钮事件：请求相应房间数据
    const handleChange = (e: RadioChangeEvent) => {
        const roomid: string = e.target.value;
        loadRoom(roomid)

    }

    //首次加载渲染‘a1’房间列表
    useEffect(() => {
        loadRoom("a1")
    }, [])

    //点击户型图时，把当前点击房间的图片地址写进 src；把预览状态打开
    const showImage = (src: string) => {
        setSrc(src);
        setVisible(true)
    }

    return <div className="room">
        {/**户型图渲染 */}
        {/**预览弹层渲染 */}
        <Image
            width={200}
            style={{ display: 'none' }}
            preview={{
                visible,
                src: src,
                onVisibleChange: (value) => {
                    setVisible(value);
                },
            }}
        />
        <Card className="mb">
            <Radio.Group defaultValue="a1" optionType="button" buttonStyle="solid" onChange={handleChange}>
                <Radio.Button value="a1">A1幢写字楼</Radio.Button>
                <Radio.Button value="a2">A2幢写字楼</Radio.Button>
                <Radio.Button value="b1">B1幢写字楼</Radio.Button>
                <Radio.Button value="b2">B2幢写字楼</Radio.Button>
                <Radio.Button value="c1">C1幢写字楼</Radio.Button>
                <Radio.Button value="c2">C2幢写字楼</Radio.Button>
                <Radio.Button value="d1">天汇国际大厦A座</Radio.Button>
                <Radio.Button value="d2">时代金融广场</Radio.Button>
            </Radio.Group>
        </Card>
        <Spin spinning={loading}>
            <Row gutter={16}>
                {/* <Col span={6} className="item">
                <Card title="房间号" extra={<a onClick={()=>setVisible(true)}>户型图</a>}>
                    <h1>201</h1>
                    <div className="clearfix mt">
                        <p className="fl">装修情况：</p>
                        <p className="fr">毛坯</p>
                    </div>
                    <div className="clearfix mt">
                        <p className="fl">房间面积</p>
                        <p className="fr">100</p>
                    </div>
                    <div className="clearfix mt">
                        <p className="fl">出租单价</p>
                        <p className="fr">100</p>
                    </div>
                </Card>
            </Col> */}
                {
                    //room数据映射渲染
                    room.map((item) => {
                        return <>
                            <Col span={6} className="item">
                                <Card title="房间号" extra={<a onClick={() => showImage(item.src)}>户型图</a>}>
                                    <h1>{item.roomNumber}</h1>
                                    <div className="clearfix mt">
                                        <p className="fl">装修情况：</p>
                                        <p className="fr">{item.decorationType}</p>
                                    </div>
                                    <div className="clearfix mt">
                                        <p className="fl">房间面积</p>
                                        <p className="fr">{item.area}㎡</p>
                                    </div>
                                    <div className="clearfix mt">
                                        <p className="fl">出租单价</p>
                                        <p className="fr">{item.unitPrice}元/平/日</p>
                                    </div>
                                </Card>
                            </Col>
                        </>
                    })
                }
            </Row>
        </Spin>
    </div>
}

export default Room