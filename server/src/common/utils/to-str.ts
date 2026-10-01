/** 把未知类型安全转成去空格的字符串，避免 undefined/null 直接参与查询与拼接 */
export function toStr(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim();
}

/** 把未知类型转成有限数值，非法值返回 undefined */
export function toNum(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
