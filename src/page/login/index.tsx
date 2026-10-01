import logo from "../../assets/logo.png"
import bg from "../../assets/bg.jpg"
import lgbg from "../../assets/lgbg.jpg"
import "./index.scss"
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from "../../api/users";
import { setToken } from "../../store/login/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
    const [form] = Form.useForm() //创建了一个Ant Design的表单实例
    const [loading, setLoading] = useState<boolean>(false) //该状态用于控制登录按钮的加载态
    const dispatch = useDispatch()
    const navigate = useNavigate()
    function handleLogin() {
        //form.validateFields()校验表单，检查 Form.Item 里配置的 rules 是否通过
        //如果失败：不会发请求，会进入 catch，Ant Design 会自动在表单项下面显示错误提示
        //先前端校验，再发请求，减少无效请求
        form.validateFields().then(async (res) => { //res: 表单数据 例如：{username: "admin",password: "admin123123"}
            setLoading(true)
            const { data: { token, username, accountName, btnAuth } } = await login(res); //登录请求，返回数据
            setLoading(false)
            dispatch(setToken(token)) //把返回的用户token存储到redux里
            sessionStorage.setItem("username", username)
            sessionStorage.setItem("accountName", accountName || res.username)
            //把用户名和按钮权限存入 sessionStorage 转换成JSON字符串
            sessionStorage.setItem("btnAuth", JSON.stringify(btnAuth))
            navigate("/", { replace: true }) //跳转到主页，并替换登录页
        }).catch((err) => {
            setLoading(false)
            console.log(err)
        })
    }

    return <div className="login" style={{ backgroundImage: `url(${bg})` }}>
        <div className="lgbg" style={{ backgroundImage: `url(${lgbg})` }}>
            <div className="part">
                <div className="title">
                    <div className="logo">
                        <img src={logo} width={100} alt="朋远智慧园区管理平台" />
                    </div>
                    <h1>朋远智慧园区管理平台</h1>
                </div>
                <Form form={form}>

                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '用户名不能为空' }, //必填                          
                            { pattern: /^\w{4,12}$/, message: "用户名必须是4-12位数字、字母或下划线" }, //必须匹配正则
                            //^ 表示字符串开始，$ 表示字符串结束，\w 表示单词字符 [A-Za-z0-9_]，{4,8} 4到8次。
                        ]}
                    >
                        <Input placeholder="请输入您的用户名" prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '密码不能为空' }]}
                    >
                        <Input.Password placeholder="请输入您的密码" prefix={<LockOutlined />} />
                        {/* 用的是密码输入框，会自动隐藏字符 */}
                    </Form.Item>
                    <Form.Item >
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={handleLogin}
                            loading={loading}
                        > {/* 根据loading展示加载态 */}
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
}

export default Login

/**
 * 1. 登录页为什么要先做前端表单校验，再发请求？
  答：因为前端校验可以提前拦截空值和格式错误，减少无效请求，提升用户体验，也能降低后端不必要的压力。但前端校验不能替代后端校
  验，真正的安全校验仍然要靠后端。

   2. Form.useForm() 的作用是什么？
  答：Form.useForm() 用来创建一个 Ant Design 表单实例，通过这个实例可以主动校验表单、获取字段值、设置字段值和重置表单。这个
  登录页里主要用它来执行 validateFields()。

  ### 3. form.validateFields() 会返回什么？
  答：如果校验通过，会返回一个 Promise，并在 then 中拿到当前表单值对象；如果校验失败，会进入 catch，同时 Ant Design 会自动显
  示表单错误提示。

  ### 4. 登录成功后为什么既存 Redux，又存 sessionStorage？
  答：Redux 负责当前运行时的全局状态共享，方便组件之间读取；sessionStorage 负责页面刷新后的状态恢复。这个项目里 token 通过
  Redux + sessionStorage 结合使用，保证刷新后仍能识别登录状态。
 */
