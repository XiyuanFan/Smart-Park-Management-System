import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TenantListQueryDto {
  @ApiPropertyOptional({ description: '页码，从 1 开始', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: '企业名称（模糊匹配）' })
  companyName?: string;

  @ApiPropertyOptional({ description: '联系人（匹配法人姓名，模糊）' })
  contact?: string;

  @ApiPropertyOptional({ description: '联系电话（模糊匹配）' })
  phone?: string;

  @ApiPropertyOptional({ description: '联系电话的别名，兼容旧调用方', deprecated: true })
  tel?: string;
}

export class DeleteTenantDto {
  @ApiProperty({ description: '要删除的企业 id', example: 1 })
  id: number | string;
}

export class BatchDeleteTenantDto {
  @ApiProperty({ description: '要批量删除的企业 id 数组', type: [Number], example: [1, 2, 3] })
  ids: (number | string)[];
}

export class SaveTenantDto {
  @ApiPropertyOptional({ description: '企业 id；不传表示新增，传了表示编辑' })
  id?: number | string;

  @ApiProperty({ description: '客户名称', example: '万物科技有限公司' })
  name: string;

  @ApiPropertyOptional({ description: '经营状态：1 营业中 / 2 暂停营业 / 3 已关闭', example: '1' })
  status?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  tel?: string;

  @ApiPropertyOptional({ description: '所属行业' })
  business?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  email?: string;

  @ApiPropertyOptional({ description: '统一信用代码' })
  creditCode?: string;

  @ApiPropertyOptional({ description: '工商注册号' })
  industryNum?: string;

  @ApiPropertyOptional({ description: '组织机构代码' })
  organizationCode?: string;

  @ApiPropertyOptional({ description: '法人名' })
  legalPerson?: string;
}
