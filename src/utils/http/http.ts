import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { message } from "antd";
import { store } from "../../store";
import { clearToken } from "../../store/login/authSlice";

//创建axios实例
const http: AxiosInstance = axios.create({
    // 开发环境指向本地后端（见根目录 .env.development），生产环境由 .env.production 决定
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000
})

//请求拦截器 -- 携带用户token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { token } = store.getState().authSlice //从redux的store中获取用户token
    if (token) {
        //Authorization专门用来携带认证信息
        //Bearer表示的是一种认证类型，表示后面携带的是一个令牌
        //后端 AuthGuard 会校验这个 JWT
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

/**
 * 清空登录态并提示。
 * token 变成 null 之后：
 *   - RequireAuth 会把当前受保护路由重定向到 /login
 *   - App.tsx 的 useEffect 依赖 token，会退回到基础路由
 * 这样用户看到的是登录页，而不是一个卡住的空页面。
 */
function handleUnauthorized() {
    store.dispatch(clearToken())
}

/**
 * 响应拦截器
 *
 * 后端已改为标准的 HTTP 状态码约定：
 *   - 成功：HTTP 200，响应体 { code: 200, message, data }
 *   - 失败：HTTP 4xx/5xx，响应体 { code, message, data: null }
 *
 * 因此这里必须同时处理两个分支：
 *   1. 成功分支：解包出 { code, message, data }
 *   2. 失败分支：从 error.response 中取出状态码与 message
 *      —— 这是原来缺失的部分。以前后端无论成败都返回 HTTP 200，
 *         只靠 body 里的 code 判断，所以从来没有错误分支。
 */
http.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        // 兼容少数仍以 HTTP 200 + 业务码表示失败的情况
        if (res && typeof res === 'object' && 'code' in res && res.code !== 200) {
            if (res.code === 401) {
                handleUnauthorized()
            }
            message.error(res.code + ":" + res.message);
            return Promise.reject(new Error(res.message))
        }
        return response.data
    },
    (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status
        const text = error.response?.data?.message || error.message || "请求失败"

        if (status === 401) {
            handleUnauthorized()
        }

        message.error(status ? `${status}:${text}` : text);
        return Promise.reject(error)
    }
)

export default http
