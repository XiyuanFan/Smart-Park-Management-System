import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE_NAME_MAP } from '../menu/menu.service';
import { toStr } from '../common/utils/to-str';
import type { SendMessageDto, SaveMessageDto } from './dto/chat.dto';

/** 与前端 src/api/chat.ts 的 ChatMessage 结构一致 */
export interface ChatMessageVo {
  id: string;
  from: string;
  to: string;
  content: string;
  time: string;
}

export interface StaffVo {
  id: string;
  name: string;
  accountName: string;
  department: string;
  role: string;
  online: boolean;
}

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /** 生成 HH:mm */
  private nowHHmm(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  private toVo(row: {
    id: string;
    fromUser: string;
    toUser: string;
    content: string;
    time: string;
  }): ChatMessageVo {
    return {
      id: row.id,
      from: row.fromUser,
      to: row.toUser,
      content: row.content,
      time: row.time,
    };
  }

  /** 通联列表：除自己以外的所有账号 */
  async listStaff(me: string): Promise<StaffVo[]> {
    const accounts = await this.prisma.account.findMany({
      where: { accountName: { not: me } },
      orderBy: { id: 'asc' },
    });

    return accounts.map((account) => ({
      id: account.accountName,
      name: account.person,
      accountName: account.accountName,
      department: account.department,
      role: ROLE_NAME_MAP[account.role] ?? account.role,
      online: account.online,
    }));
  }

  /** 取「我」与好友之间的双向消息，按时间正序 */
  async listMessages(me: string, friendId: string): Promise<ChatMessageVo[]> {
    if (!friendId) throw new BadRequestException('缺少 friendId');

    const rows = await this.prisma.chatMessage.findMany({
      where: {
        OR: [
          { fromUser: me, toUser: friendId },
          { fromUser: friendId, toUser: me },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map((row) => this.toVo(row));
  }

  /** 发送方由 JWT 决定，前端只传 { to, content } */
  async send(me: string, dto: SendMessageDto): Promise<ChatMessageVo> {
    const to = toStr(dto?.to);
    const content = dto?.content === undefined ? '' : String(dto.content);

    if (!to) throw new BadRequestException('缺少接收人 to');
    if (!content.trim()) throw new BadRequestException('消息内容不能为空');

    const row = {
      id: `${me}-${to}-${Date.now()}`,
      fromUser: me,
      toUser: to,
      content,
      time: this.nowHHmm(),
    };

    await this.prisma.chatMessage.create({ data: row });
    return this.toVo(row);
  }

  /** 前端本地乐观更新后回写整条消息，按 id 幂等 upsert */
  async save(dto: SaveMessageDto): Promise<ChatMessageVo> {
    const id = toStr(dto?.id);
    const from = toStr(dto?.from);
    const to = toStr(dto?.to);
    const content = dto?.content === undefined ? '' : String(dto.content);

    if (!id || !from || !to) throw new BadRequestException('消息参数不完整');

    const payload = {
      id,
      fromUser: from,
      toUser: to,
      content,
      time: dto.time ? String(dto.time) : this.nowHHmm(),
    };

    const saved = await this.prisma.chatMessage.upsert({
      where: { id },
      create: payload,
      update: { content: payload.content, time: payload.time },
    });

    return this.toVo(saved);
  }
}
