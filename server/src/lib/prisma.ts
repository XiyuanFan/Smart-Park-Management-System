// 必须先加载 .env，Prisma Client 初始化时要读取 DATABASE_URL
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

/**
 * 全局单例 PrismaClient。
 * 开发模式下 tsx watch 会反复热重载模块，若每次都 new 一个客户端，
 * 连接池会被迅速耗尽，所以挂到 globalThis 上复用。
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
