import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 4 不会自动捕获 async 处理函数里抛出的异常，
 * 未捕获的 Promise rejection 会直接静默挂掉请求。
 * 这里统一包一层，把异常交给最后的全局错误中间件处理。
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
