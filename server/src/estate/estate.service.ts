import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toStr } from '../common/utils/to-str';
import type { RoomListQueryDto } from './dto/estate.dto';

/** 与前端 src/page/estate/room.tsx 的 RoomType 对应 */
export interface RoomItem {
  roomNumber: number;
  decorationType: string;
  area: number;
  unitPrice: number;
  src: string;
}

@Injectable()
export class EstateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 前端解构的是 data.rooms，所以这里必须保留 { rooms: [...] } 这层嵌套结构。
   */
  async listRooms(dto: RoomListQueryDto): Promise<{ rooms: RoomItem[] }> {
    const roomid = toStr(dto?.roomid);
    if (!roomid) throw new BadRequestException('缺少楼栋标识 roomid');

    const rooms = await this.prisma.room.findMany({
      where: { building: roomid },
      orderBy: { roomNumber: 'asc' },
      select: {
        roomNumber: true,
        decorationType: true,
        area: true,
        unitPrice: true,
        src: true,
      },
    });

    return { rooms };
  }
}
