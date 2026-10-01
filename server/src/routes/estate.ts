import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { badRequest, ok } from "../lib/response";

const router = Router();

/**
 * POST /roomList
 * 前端 src/page/estate/room.tsx 解构的是 data.rooms，
 * 所以这里必须保留 { rooms: [...] } 这层嵌套结构。
 */
router.post(
  "/roomList",
  asyncHandler(async (req, res) => {
    const roomid = req.body?.roomid ? String(req.body.roomid).trim() : "";
    if (!roomid) return badRequest(res, "缺少楼栋标识 roomid");

    const rooms = await prisma.room.findMany({
      where: { building: roomid },
      orderBy: { roomNumber: "asc" },
      select: {
        roomNumber: true,
        decorationType: true,
        area: true,
        unitPrice: true,
        src: true,
      },
    });

    return ok(res, { rooms }, "成功");
  })
);

export default router;
