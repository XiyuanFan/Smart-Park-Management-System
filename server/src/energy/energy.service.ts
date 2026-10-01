import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

export interface EnergySeries {
  name: string;
  data: number[];
}

/** 能耗曲线几乎不变，缓存 10 分钟 */
const ENERGY_CACHE_TTL_MS = 10 * 60 * 1000;
const ENERGY_CACHE_KEY = 'energy:series';

@Injectable()
export class EnergyService {
  private readonly logger = new Logger(EnergyService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  /** 返回 echarts 需要的 series 结构：[{ name: '煤', data: [7 天数值] }] */
  async getEnergyData(): Promise<EnergySeries[]> {
    const cached = await this.cache.get<EnergySeries[]>(ENERGY_CACHE_KEY);
    if (cached) {
      this.logger.debug(`能耗缓存命中: ${ENERGY_CACHE_KEY}`);
      return cached;
    }

    const rows = await this.prisma.energyRecord.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });

    const data = rows.map((row) => ({
      name: row.name,
      data: Array.isArray(row.series) ? (row.series as number[]) : [],
    }));

    await this.cache.set(ENERGY_CACHE_KEY, data, ENERGY_CACHE_TTL_MS);
    this.logger.debug(`能耗缓存写入: ${ENERGY_CACHE_KEY} (${data.length} 条曲线)`);
    return data;
  }

  /** 能耗数据变更后调用，清空缓存 */
  async invalidate(): Promise<void> {
    await this.cache.del(ENERGY_CACHE_KEY);
    this.logger.debug(`能耗缓存失效: ${ENERGY_CACHE_KEY}`);
  }
}
