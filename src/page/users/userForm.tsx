import { Modal, Row, Col, Form, Input ,Radio, message} from "antd"
// Modal：弹窗容器
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { editUser } from "../../api/userList"; 
interface FormProps {
    visible: boolean;
    hideModal: () => void;
    title: string;
    loadData:()=>void
} //props的类型

function UserForm(props: FormProps) {
    const [form]=Form.useForm(); //创建Ant Design 的表单实例
    //在store中获得当前编辑项的数据
    const {userData}= useSelector((state:any)=>state.userSlice)  
    const { visible, hideModal, title,loadData } = props

    //点击弹窗“确定”按钮时执行的逻辑
    const handleOk=()=>{
        form.validateFields().then(async (res)=>{
            // 表单里没有 id 字段，编辑场景必须从 Redux 里的 userData 补上，
            // 否则后端无法定位要更新哪一条记录（只能当成新增处理）。
            const payload = title === "编辑企业" && userData?.id
                ? { ...res, id: userData.id }
                : res;
            const {data}=await editUser(payload);
            message.success(data)
            hideModal(); //关闭弹窗，通知父组件把 isModalOpen 改成 false
            loadData() // 刷新列表
        }).catch((err)=>{
            console.log(err)
        })
    }

    //这就是典型的新增 / 编辑复用表单思路。
    //弹窗打开时，根据当前场景初始化表单内容，清空还是显示当前编辑项的用户数据(把当前选中的用户数据回填到表单里，方便用户修改)
    useEffect(()=>{
        title=="新增企业"? form.resetFields():form.setFieldsValue(userData)
    },[visible])  

    return <>
        <Modal
            title={title}
            open={visible} // 控制弹窗是否显示，visible由父组件传入。
            onCancel={hideModal} // 点击右上角关闭或遮罩层关闭时，调用关闭函数。
            width={800}
            onOk={handleOk} // 点击确定按钮时，触发表单校验和提交逻辑。
        >
            <Form
                form={form}
                labelCol={{span:8}}
                wrapperCol={{span:16}}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="客户名称"
                            name="name"
                            rules={[{ required: true, message: "客户名称不能为空" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="联系电话"
                            name="tel"
                            rules={[{ required: true, message: "联系电话不能为空" },{pattern:/^1[3-9]\d{9}$/,message:"请输入有效的手机号"}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="经营状态"
                            name="status"
                            rules={[{ required: true, message: "经营状态不能为空" }]}
                        >
                            <Radio.Group>
                                <Radio value="1">营业中</Radio>
                                <Radio value="2">暂停营业</Radio>
                                <Radio value="3">已关闭</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="所属行业"
                            name="business"
                            rules={[{ required: true, message: "所属行业不能为空" }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[{ required: true, message: "邮箱不能为空" }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="统一信用代码"
                            name="creditCode"
                            rules={[{ required: true, message: "统一信用代码不能为空" }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="工商注册号"
                            name="industryNum"
                            rules={[{ required: true, message: "工商注册号不能为空" }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="组织机构代码"
                            name="organizationCode"
                            rules={[{ required: true, message: "组织机构代码不能为空" }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="法人名"
                            name="legalPerson"
                            rules={[{ required: true, message: "法人名不能为空" }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    
                </Row>
            </Form>
        </Modal>

    </>
}
export default UserForm

/** 是用户管理模块的弹窗表单组件，基于 Ant Design 的 Modal + Form 实现新增和编辑场景复用，通过
  resetFields 与 setFieldsValue 区分表单初始化方式，通过 validateFields 完成前端校验，提交成功后关闭弹窗并刷新父列表，形成
  完整的列表页编辑闭环。 */