import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { TokenPayload } from '../../auth/types/token-payload';

/**
 * 从请求上下文里取出 AuthGuard 解析好的 JWT 载荷。
 * 例：@CurrentUser() user: TokenPayload
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: TokenPayload }>();
    return request.user as TokenPayload;
  }
);
