import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import type { TokenPayload } from './types/token-payload';

/**
 * 全局鉴权守卫：解析 Authorization: Bearer <token>。
 *
 * 相比旧的 Express 中间件，这里是标准的 NestJS Guard：
 *   - 通过 @Public() 装饰器豁免（如 /login、/health）
 *   - 抛 UnauthorizedException，由 AllExceptionsFilter 统一转成 HTTP 401
 *   - 解析出的用户挂到 request.user，用 @CurrentUser() 取值
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: TokenPayload }>();
    const header = request.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('登录已失效，请重新登录');
    }

    try {
      request.user = await this.jwtService.verifyAsync<TokenPayload>(token);
      return true;
    } catch {
      // token 过期或被篡改，统一按未登录处理
      throw new UnauthorizedException('登录已失效，请重新登录');
    }
  }
}
