import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma, Tenant } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toStr } from '../common/utils/to-str';
import type {
  BatchDeleteTenantDto,
  DeleteTenantDto,
  SaveTenantDto,
  TenantListQueryDto,
} from './dto/tenant.dto';

export interface PagedResult<T> {
  list: T[];
  total: number;
}

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: TenantListQueryDto): Promise<PagedResult<Tenant>> {
    const page = Number(query?.page) || 1;
    const pageSize = Number(query?.pageSize) || 10;

    const companyName = toStr(query?.companyName);
    const contact = toStr(query?.contact);
    // 前端页面实际发的是 phone，旧接口声明的是 tel，两者都接受
    const phone = toStr(query?.phone ?? query?.tel);

    const where: Prisma.TenantWhereInput = {};
    if (companyName) where.name = { contains: companyName };
    // 表里没有独立的「联系人」字段，用法人姓名承载该查询条件
    if (contact) where.legalPerson = { contains: contact };
    if (phone) where.tel = { contains: phone };

    const [list, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return { list, total };
  }

  async remove(dto: DeleteTenantDto): Promise<string> {
    const id = Number(dto?.id);
    if (!Number.isFinite(id)) throw new BadRequestException('缺少有效的 id');

    await this.prisma.tenant.deleteMany({ where: { id } });
    return '操作成功';
  }

  async batchRemove(dto: BatchDeleteTenantDto): Promise<string> {
    const ids = (Array.isArray(dto?.ids) ? dto.ids : [])
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));

    if (!ids.length) throw new BadRequestException('请至少选择一条要删除的数据');

    await this.prisma.tenant.deleteMany({ where: { id: { in: ids } } });
    return '操作成功';
  }

  /**
   * 新增 / 编辑复用同一入口：带 id 走更新，不带 id 走新增。
   */
  async save(dto: SaveTenantDto): Promise<string> {
    const data: Prisma.TenantUncheckedCreateInput = {
      name: toStr(dto.name),
      status: toStr(dto.status) || '1',
      tel: toStr(dto.tel),
      business: toStr(dto.business),
      email: toStr(dto.email),
      creditCode: toStr(dto.creditCode),
      industryNum: toStr(dto.industryNum),
      organizationCode: toStr(dto.organizationCode),
      legalPerson: toStr(dto.legalPerson),
    };

    if (!data.name) throw new BadRequestException('客户名称不能为空');

    const rawId = dto.id;
    if (rawId !== undefined && rawId !== null && rawId !== '') {
      const id = Number(rawId);
      if (!Number.isFinite(id)) throw new BadRequestException('id 格式有误');

      const result = await this.prisma.tenant.updateMany({ where: { id }, data });
      if (result.count === 0) throw new BadRequestException('要编辑的企业不存在');
    } else {
      await this.prisma.tenant.create({ data });
    }

    return '操作成功';
  }
}
