import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'responseMessage';

/**
 * 自定义成功响应的 message。
 * 不使用时默认返回「请求成功」。
 * 例：@ResponseMessage('操作成功')
 */
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_KEY, message);
