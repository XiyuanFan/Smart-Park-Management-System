/**
 * 统一响应体。
 * 成功与失败都使用这个结构，区别在于：
 *   - 成功：HTTP 200，code = 200
 *   - 失败：HTTP 4xx/5xx，code 与 HTTP 状态码一致
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
