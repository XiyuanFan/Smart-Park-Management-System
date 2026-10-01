import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { map, type Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import type { ApiResponse } from '../types/api-response';

/**
 * 统一成功响应体：{ code, message, data }
 *
 * 这里的 code 取的是真实的 HTTP 状态码（成功时恒为 200），
 * 而失败响应由 AllExceptionsFilter 处理并返回对应的 4xx/5xx。
 * 前端 http.ts 的成功分支依赖 code === 200 判断，语义保持一致。
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? '请求成功';

    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        code: statusCode,
        message,
        data: (data === undefined ? null : data) as T,
      }))
    );
  }
}
