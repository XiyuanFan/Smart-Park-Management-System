import type { Response } from "express";

/**
 * 统一响应体结构，与前端 src/utils/http/http.ts 的响应拦截器约定一致：
 *   res.code !== 200  ->  前端弹 message.error 并 reject
 *
 * 重要：这里**始终返回 HTTP 200**，业务状态码放在 body 的 code 字段里。
 * 原因是前端只在响应拦截器的「成功分支」里判断 code，
 * 没有注册错误拦截器；若返回 HTTP 401/500，axios 会直接抛错，
 * 前端拿不到 message，只能看到一个无提示的失败。
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export function ok<T>(res: Response, data: T, message = "请求成功") {
  return res.status(200).json({ code: 200, message, data });
}

export function bizFail(res: Response, code: number, message: string) {
  return res.status(200).json({ code, message, data: null });
}

/** 401：未登录或 token 失效 */
export function unauthorized(res: Response, message = "登录已失效，请重新登录") {
  return bizFail(res, 401, message);
}

/** 400：参数校验失败 */
export function badRequest(res: Response, message = "请求参数有误") {
  return bizFail(res, 400, message);
}

/** 500：服务端异常 */
export function serverError(res: Response, message = "服务器内部错误") {
  return bizFail(res, 500, message);
}
