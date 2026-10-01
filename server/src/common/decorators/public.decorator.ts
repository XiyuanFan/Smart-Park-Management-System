import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 标记接口为公开访问，跳过全局 AuthGuard。
 * 目前只有 POST /login 需要。
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
