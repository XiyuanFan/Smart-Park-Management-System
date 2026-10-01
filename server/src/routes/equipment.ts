import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { ok } from "../lib/response";

const router = Router();

/**
 * POST /equipmentList
 * 注意：这个接口在原来的 mock/index.ts 里**从未实现**，
 * 但前端 src/page/equipment/index.tsx 一直在调用它，
 * 所以设备管理页此前是拿不到数据的。这里正式补上。
 */
router.post(
  "/equipmentList",
  asyncHandler(async (req, res) => {
    const page = Number(req.body?.page) || 1;
    const pageSize = Number(req.body?.pageSize) || 10;
    const name = req.body?.name ? String(req.body.name).trim() : "";
    const person = req.body?.person ? String(req.body.person).trim() : "";

    const where: Prisma.EquipmentWhereInput = {};
    if (name) {
      // 搜索框提示为"设备名称或编号"，两个字段任一命中即可
      where.OR = [{ name: { contains: name } }, { no: { contains: name } }];
    }
    if (person) where.person = { contains: person };

    const [list, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
      prisma.equipment.count({ where }),
    ]);

    return ok(res, { list, total }, "成功");
  })
);

export default router;
