import { ApiPropertyOptional } from '@nestjs/swagger';

export class ContractListQueryDto {
  @ApiPropertyOptional({ description: '页码，从 1 开始', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: '合同编号（模糊匹配）' })
  contractNo?: string;

  @ApiPropertyOptional({ description: '联系人（模糊匹配）' })
  person?: string;

  @ApiPropertyOptional({ description: '联系电话（模糊匹配）' })
  tel?: string;
}

export class BillListQueryDto {
  @ApiPropertyOptional({ description: '页码，从 1 开始', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: '账单编号（模糊匹配）' })
  no?: string;

  @ApiPropertyOptional({ description: '账单状态：1 未结清 / 2 已结清' })
  status?: string;

  @ApiPropertyOptional({ description: '起始日期下限，格式 YYYY-MM-DD' })
  startDate?: string;

  @ApiPropertyOptional({ description: '起始日期上限，格式 YYYY-MM-DD' })
  endDate?: string;
}
