import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { badRequest, ok } from "../lib/response";
import { roleNameMap } from "../lib/menu";

const router = Router();

/** 生成 HH:mm，与原 mock 的展示格式保持一致 */
function nowHHmm(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** 把一条消息记录转成前端 ChatMessage 结构 */
function toMessage(row: {
  id: string;
  fromUser: string;
  toUser: string;
  content: string;
  time: string;
}) {
  return {
    id: row.id,
    from: row.fromUser,
    to: row.toUser,
    content: row.content,
    time: row.time,
  };
}

/**
 * GET /chat/v2/staff
 * 通联列表：除自己以外的所有账号
 */
router.get(
  "/chat/v2/staff",
  asyncHandler(async (req, res) => {
    const me = req.user!.accountName;

    const accounts = await prisma.account.findMany({
      where: { accountName: { not: me } },
      orderBy: { id: "asc" },
    });

    const data = accounts.map((account) => ({
      id: account.accountName,
      name: account.person,
      accountName: account.accountName,
      department: account.department,
      role: roleNameMap[account.role] ?? account.role,
      online: account.online,
    }));

    return ok(res, data, "请求成功");
  })
);

/**
 * GET /chat/v2/messages?friendId=xxx
 * 取「我」与好友之间的双向消息，按时间正序
 */
router.get(
  "/chat/v2/messages",
  asyncHandler(async (req, res) => {
    const me = req.user!.accountName;
    const friendId = req.query.friendId ? String(req.query.friendId).trim() : "";
    if (!friendId) return badRequest(res, "缺少 friendId");

    const rows = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { fromUser: me, toUser: friendId },
          { fromUser: friendId, toUser: me },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return ok(res, rows.map(toMessage), "请求成功");
  })
);

/**
 * POST /chat/v2/send
 * 发送方由 token 决定，前端只传 { to, content }
 */
router.post(
  "/chat/v2/send",
  asyncHandler(async (req, res) => {
    const to = req.body?.to ? String(req.body.to).trim() : "";
    const content = req.body?.content ? String(req.body.content) : "";

    if (!to) return badRequest(res, "缺少接收人 to");
    if (!content.trim()) return badRequest(res, "消息内容不能为空");

    const from = req.user!.accountName;
    const message = {
      id: `${from}-${to}-${Date.now()}`,
      fromUser: from,
      toUser: to,
      content,
      time: nowHHmm(),
    };

    await prisma.chatMessage.create({ data: message });
    return ok(res, toMessage(message), "发送成功");
  })
);

/**
 * POST /chat/v2/save
 * 前端在本地乐观更新后回写整条消息，按 id 幂等 upsert
 */
router.post(
  "/chat/v2/save",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {};
    const id = body.id ? String(body.id).trim() : "";
    const from = body.from ? String(body.from).trim() : "";
    const to = body.to ? String(body.to).trim() : "";
    const content = body.content !== undefined ? String(body.content) : "";

    if (!id || !from || !to) return badRequest(res, "消息参数不完整");

    const payload = {
      id,
      fromUser: from,
      toUser: to,
      content,
      time: body.time ? String(body.time) : nowHHmm(),
    };

    const saved = await prisma.chatMessage.upsert({
      where: { id },
      create: payload,
      update: { content: payload.content, time: payload.time },
    });

    return ok(res, toMessage(saved), "保存成功");
  })
);

export default router;
