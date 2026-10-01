import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/api-response';

/**
 * 全局异常过滤器：把所有异常统一成 { code, message, data } 结构。
 *
 * 与旧 Express 版的关键区别：这里**返回真实的 HTTP 状态码**
 * （401 / 400 / 404 / 500），而不是把业务码塞进 HTTP 200 的响应体里。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = this.extractMessage(exception);
    } else {
      // 未预期的异常：完整打印堆栈便于排查，但对外只返回通用文案，避免泄漏内部实现
      this.logger.error(
        `未捕获异常 ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception)
      );
    }

    const body: ApiResponse<null> = { code: status, message, data: null };

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} -> ${status} ${message}`);
    }

    response.status(status).json(body);
  }

  private extractMessage(exception: HttpException): string {
    const res = exception.getResponse();

    if (typeof res === 'string') return res;

    if (res && typeof res === 'object') {
      const raw = (res as { message?: unknown }).message;
      // Nest 的 ValidationPipe 会返回 string[]，拼成一行更利于前端直接展示
      if (Array.isArray(raw)) return raw.join('；');
      if (typeof raw === 'string') return raw;
    }

    return exception.message;
  }
}
