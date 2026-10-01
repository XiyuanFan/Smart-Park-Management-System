import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { ok } from "../lib/response";

const router = Router();

/**
 * GET /energyData
 * 返回 echarts 需要的 series 结构：[{ name: "煤", data: [7 天数值] }]
 */
router.get(
  "/energyData",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.energyRecord.findMany({
      orderBy: [{ sort: "asc" }, { id: "asc" }],
    });

    const data = rows.map((row) => ({
      name: row.name,
      data: Array.isArray(row.series) ? row.series : [],
    }));

    return ok(res, data, "请求成功");
  })
);

export default router;
