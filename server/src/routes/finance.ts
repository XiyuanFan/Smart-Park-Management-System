import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { ok } from "../lib/response";

const router = Router();

function toStr(v: unknown): string {
  return v === undefined || v === null ? "" : String(v).trim();
}

/**
 * POST /contractList
 * 查询条件（见 src/page/finance/contract.tsx）：contractNo / person / tel
 * 原来的 mock 完全忽略这些条件，只做假分页；这里全部落成真实 SQL 条件。
 */
router.post(
  "/contractList",
  asyncHandler(async (req, res) => {
    const page = Number(req.body?.page) || 1;
    const pageSize = Number(req.body?.pageSize) || 10;

    const contractNo = toStr(req.body?.contractNo);
    const person = toStr(req.body?.person);
    const tel = toStr(req.body?.tel);

    const where: Prisma.ContractWhereInput = {};
    if (contractNo) where.contractNo = { contains: contractNo };
    if (person) where.person = { contains: person };
    if (tel) where.tel = { contains: tel };

    const [list, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
      prisma.contract.count({ where }),
    ]);

    return ok(res, { list, total }, "成功");
  })
);

/**
 * POST /billList
 * 查询条件（见 src/api/contract.ts 的 SearchData2）：no / status / startDate / endDate
 */
router.post(
  "/billList",
  asyncHandler(async (req, res) => {
    const page = Number(req.body?.page) || 1;
    const pageSize = Number(req.body?.pageSize) || 10;

    const no = toStr(req.body?.no);
    const status = toStr(req.body?.status);
    const startDate = toStr(req.body?.startDate);
    const endDate = toStr(req.body?.endDate);

    const where: Prisma.BillWhereInput = {};
    if (no) where.accountNo = { contains: no };
    if (status) where.status = status;
    // 起止日期按账单的起始日做区间筛选（统一 YYYY-MM-DD 文本，字典序即时间序）
    if (startDate || endDate) {
      where.startDate = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      };
    }

    const [list, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
      prisma.bill.count({ where }),
    ]);

    return ok(res, { list, total }, "成功");
  })
);

export default router;
