import type { NextFunction, Request, Response } from "express";
import { verifyToken, type TokenPayload } from "../lib/jwt";
import { unauthorized } from "../lib/response";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * 鉴权中间件：解析 Authorization: Bearer <token>
 * 前端 src/utils/http/http.ts 的请求拦截器会自动带上这个头。
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return unauthorized(res);
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    // token 过期或被篡改，统一按未登录处理
    return unauthorized(res);
  }
}
