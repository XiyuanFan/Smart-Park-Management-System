
import { post, get } from "../utils/http/request";
interface LoginData {
    username: string,
    password: string
}

interface AccountData {
    accountName: string
}
export function login(data: LoginData) {
    return post("/login", data)
}

export function getMenu() {
    return get("/menu") //请求菜单接口函数
}

export function getAccountList(data: AccountData) {
    return post("/accountList", data)
}

/**
 * 1. 为什么要把接口单独封装在 api/users.ts 里？
  答：为了把业务语义和底层请求细节分离。业务层只关心“获取菜单”“登录”这些动作，
  不需要直接操作 axios，便于维护、复用和后续替换接口实现。
 */

