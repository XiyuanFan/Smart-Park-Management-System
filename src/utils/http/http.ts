import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
import { store } from "../../store";
import { clearToken } from "../../store/login/authSlice";

//创建axios实例
const http: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, //基础地址
    timeout: 5000
})
/**
 * 环境变量里配置的是：REACT_APP_API_URL=https://www.demo.com
  所以：get("/menu")  最终会变成请求：https://www.demo.com/menu
 */

//请求拦截器 -- 携带用户token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { token } = store.getState().authSlice //从redux的store中获取用户token
    if (token) {
        //Authorization专门用来携带认证信息
        //Bearer表示的是一种认证类型，表示后面携带的是一个令牌
        //实际请求时会自动带上当前登录用户的身份信息，模拟鉴权流程
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})


//响应拦截器 -- 处理返回结果
http.interceptors.response.use((response: AxiosResponse) => {
    const res = response.data
    if (res.code != 200) {
        /**
         * 401 表示 token 缺失、过期或被篡改（后端由 JWT 校验得出）。
         * 这里主动清掉登录态，token 变成 null 后：
         *   - RequireAuth 会把当前受保护路由重定向到 /login
         *   - App.tsx 的 useEffect 依赖 token，会退回到基础路由
         * 这样用户看到的是登录页，而不是一个卡住的空页面。
         */
        if (res.code === 401) {
            store.dispatch(clearToken())
        }
        message.error(res.code + ":" + res.message);
        return Promise.reject(new Error(res.message))
    }
    return response.data
})

export default http





