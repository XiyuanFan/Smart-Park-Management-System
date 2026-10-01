import http from "./http"
interface ApiResponse {
    code: number;
    message: string,
    data: any
}


// 对 axios 实例的二次封装，统一提供 get、post 方法，屏蔽底层调用细节，并让业务接口层保持一致的调用方式。
// 统一所有 GET/POST 调用方式

export function get(url: string, params?: any): Promise<ApiResponse> {
    return http.get(url, { params })
} //返回Promise对象，resolve 时会得到 ApiResponse 类型的值

export function post(url: string, data?: any): Promise<ApiResponse> {
    return http.post(url, data)
}