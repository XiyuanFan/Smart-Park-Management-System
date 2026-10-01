import { Injectable } from '@nestjs/common';
import type { Equipment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toStr } from '../common/utils/to-str';
import type { PagedResult } from '../tenant/tenant.service';
import type { EquipmentListQueryDto } from './dto/equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 说明：这个接口在原来的 mock/index.ts 中从未实现，
   * 但前端 src/page/equipment/index.tsx 一直在调用它，
   * 所以设备管理页此前拿不到数据。
   */
  async list(query: EquipmentListQueryDto): Promise<PagedResult<Equipment>> {
    const page = Number(query?.page) || 1;
    const pageSize = Number(query?.pageSize) || 10;
    const name = toStr(query?.name);
    const person = toStr(query?.person);

    const where: Prisma.EquipmentWhereInput = {};
    if (name) {
      // 搜索框提示为「设备名称或编号」，两个字段任一命中即可
      where.OR = [{ name: { contains: name } }, { no: { contains: name } }];
    }
    if (person) where.person = { contains: person };

    const [list, total] = await Promise.all([
      this.prisma.equipment.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.equipment.count({ where }),
    ]);

    return { list, total };
  }
}
