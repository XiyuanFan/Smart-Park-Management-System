import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { asyncHandler } from "../lib/asyncHandler";
import { badRequest, bizFail, ok } from "../lib/response";
import { getMenuTreeByRole } from "../lib/menu";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * POST /login
 * 对应前端 src/api/users.ts -> login()
 * 返回结构与原 mock 完全一致：{ username, accountName, token, btnAuth }
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return badRequest(res, "用户名和密码不能为空");
    }

    const account = await prisma.account.findUnique({
      where: { accountName: String(username) },
    });

    // 用户不存在与密码错误返回同一个提示，避免账号枚举
    if (!account || !bcrypt.compareSync(String(password), account.password)) {
      return bizFail(res, 401, "用户名或密码有误");
    }

    const token = signToken({
      accountName: account.accountName,
      role: account.role,
      person: account.person,
    });

    return ok(
      res,
      {
        username: account.person,
        accountName: account.accountName,
        token,
        btnAuth: Array.isArray(account.btnAuth) ? account.btnAuth : [],
      },
      "登录成功"
    );
  })
);

/**
 * GET /menu
 * 由 token 里的角色决定返回哪棵菜单树。
 * 前端 App.tsx 收到后交给 generateRoutes 递归生成动态路由。
 */
router.get(
  "/menu",
  requireAuth,
  asyncHandler(async (req, res) => {
    const menu = await getMenuTreeByRole(req.user!.role);
    return ok(res, menu);
  })
);

export default router;
