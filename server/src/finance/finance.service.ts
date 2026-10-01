import { Injectable } from '@nestjs/common';
import type { Bill, Contract, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toStr } from '../common/utils/to-str';
import type { PagedResult } from '../tenant/tenant.service';
import type { BillListQueryDto, ContractListQueryDto } from './dto/finance.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询条件：contractNo / person / tel
   * 原来的 mock 完全忽略这些条件只做假分页，这里全部落成真实 SQL 条件。
   */
  async listContracts(query: ContractListQueryDto): Promise<PagedResult<Contract>> {
    const page = Number(query?.page) || 1;
    const pageSize = Number(query?.pageSize) || 10;

    const contractNo = toStr(query?.contractNo);
    const person = toStr(query?.person);
    const tel = toStr(query?.tel);

    const where: Prisma.ContractWhereInput = {};
    if (contractNo) where.contractNo = { contains: contractNo };
    if (person) where.person = { contains: person };
    if (tel) where.tel = { contains: tel };

    const [list, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.contract.count({ where }),
    ]);

    return { list, total };
  }

  /** 查询条件：no / status / startDate / endDate */
  async listBills(query: BillListQueryDto): Promise<PagedResult<Bill>> {
    const page = Number(query?.page) || 1;
    const pageSize = Number(query?.pageSize) || 10;

    const no = toStr(query?.no);
    const status = toStr(query?.status);
    const startDate = toStr(query?.startDate);
    const endDate = toStr(query?.endDate);

    const where: Prisma.BillWhereInput = {};
    if (no) where.accountNo = { contains: no };
    if (status) where.status = status;
    // 起止日期按账单起始日做区间筛选（统一 YYYY-MM-DD 文本，字典序即时间序）
    if (startDate || endDate) {
      where.startDate = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      };
    }

    const [list, total] = await Promise.all([
      this.prisma.bill.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.bill.count({ where }),
    ]);

    return { list, total };
  }
}
