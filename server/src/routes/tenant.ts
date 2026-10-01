import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { badRequest, ok } from "../lib/response";

const router = Router();

function toStr(v: unknown): string {
  return v === undefined || v === null ? "" : String(v).trim();
}

/**
 * POST /userList
 * 前端实际提交的查询字段是 { companyName, contact, phone }（见 page/users/index.tsx），
 * 同时兼容 api/userList.ts 里声明的 tel 字段名。
 */
router.post(
  "/userList",
  asyncHandler(async (req, res) => {
    const page = Number(req.body?.page) || 1;
    const pageSize = Number(req.body?.pageSize) || 10;

    const companyName = toStr(req.body?.companyName);
    const contact = toStr(req.body?.contact);
    const phone = toStr(req.body?.phone ?? req.body?.tel);

    const where: Prisma.TenantWhereInput = {};
    if (companyName) where.name = { contains: companyName };
    // 表里没有独立的"联系人"字段，用法人姓名承载该查询条件
    if (contact) where.legalPerson = { contains: contact };
    if (phone) where.tel = { contains: phone };

    const [list, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
      prisma.tenant.count({ where }),
    ]);

    return ok(res, { list, total }, "成功");
  })
);

/** POST /deleteUser 单个删除 */
router.post(
  "/deleteUser",
  asyncHandler(async (req, res) => {
    const id = Number(req.body?.id);
    if (!Number.isFinite(id)) return badRequest(res, "缺少有效的 id");

    await prisma.tenant.deleteMany({ where: { id } });
    return ok(res, "操作成功", "成功");
  })
);

/** POST /batchDeleteUser 批量删除 */
router.post(
  "/batchDeleteUser",
  asyncHandler(async (req, res) => {
    const raw = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const ids = raw.map((v: unknown) => Number(v)).filter((v: number) => Number.isFinite(v));

    if (!ids.length) return badRequest(res, "请至少选择一条要删除的数据");

    await prisma.tenant.deleteMany({ where: { id: { in: ids } } });
    return ok(res, "操作成功", "成功");
  })
);

/**
 * POST /editUser
 * 带 id 走更新，不带 id 走新增（前端新增/编辑复用同一个弹窗表单）。
 */
router.post(
  "/editUser",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {};

    const data = {
      name: toStr(body.name),
      status: toStr(body.status) || "1",
      tel: toStr(body.tel),
      business: toStr(body.business),
      email: toStr(body.email),
      creditCode: toStr(body.creditCode),
      industryNum: toStr(body.industryNum),
      organizationCode: toStr(body.organizationCode),
      legalPerson: toStr(body.legalPerson),
    };

    if (!data.name) return badRequest(res, "客户名称不能为空");

    if (body.id !== undefined && body.id !== null && body.id !== "") {
      const id = Number(body.id);
      if (!Number.isFinite(id)) return badRequest(res, "id 格式有误");

      const result = await prisma.tenant.updateMany({ where: { id }, data });
      if (result.count === 0) return badRequest(res, "要编辑的企业不存在");
    } else {
      await prisma.tenant.create({ data });
    }

    return ok(res, "操作成功", "成功");
  })
);

export default router;
