import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { ok } from "../lib/response";
import { getMenuTreeByRole } from "../lib/menu";

const router = Router();

/**
 * POST /accountList
 * 账号管理列表：每个账号额外带上「它所属角色能看到的那棵菜单树」，
 * 用于在系统设置页直接预览该账号的菜单权限。
 */
router.post(
  "/accountList",
  asyncHandler(async (_req, res) => {
    const accounts = await prisma.account.findMany({ orderBy: { id: "asc" } });

    // 角色数量很少，按角色缓存菜单树，避免同一角色重复查库
    const menuCache = new Map<string, Awaited<ReturnType<typeof getMenuTreeByRole>>>();
    const getMenu = async (role: string) => {
      if (!menuCache.has(role)) {
        menuCache.set(role, await getMenuTreeByRole(role));
      }
      return menuCache.get(role)!;
    };

    const list = await Promise.all(
      accounts.map(async (account) => ({
        id: account.id,
        accountName: account.accountName,
        auth: account.role,
        person: account.person,
        tel: account.tel,
        department: account.department,
        menu: await getMenu(account.role),
      }))
    );

    return ok(res, { list, total: list.length }, "成功");
  })
);

export default router;
