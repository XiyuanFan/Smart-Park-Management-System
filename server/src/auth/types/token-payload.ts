/** JWT 载荷：签发与校验共用 */
export interface TokenPayload {
  /** 登录账号 */
  accountName: string;
  /** 角色：admin / manager / user / customize */
  role: string;
  /** 姓名 */
  person: string;
}
