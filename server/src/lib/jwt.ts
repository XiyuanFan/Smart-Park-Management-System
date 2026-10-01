import jwt from "jsonwebtoken";

export interface TokenPayload {
  /** 登录账号 */
  accountName: string;
  /** 角色：admin / manager / user / customize */
  role: string;
  /** 姓名 */
  person: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("缺少环境变量 JWT_SECRET，请检查 server/.env");
  }
  return secret;
}

export function signToken(payload: TokenPayload): string {
  const options = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "2h") as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign({ ...payload }, getSecret(), options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret()) as TokenPayload;
}
