import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface EnergySeries {
  name: string;
  data: number[];
}

@Injectable()
export class EnergyService {
  constructor(private readonly prisma: PrismaService) {}

  /** 返回 echarts 需要的 series 结构：[{ name: '煤', data: [7 天数值] }] */
  async getEnergyData(): Promise<EnergySeries[]> {
    const rows = await this.prisma.energyRecord.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });

    return rows.map((row) => ({
      name: row.name,
      data: Array.isArray(row.series) ? (row.series as number[]) : [],
    }));
  }
}
