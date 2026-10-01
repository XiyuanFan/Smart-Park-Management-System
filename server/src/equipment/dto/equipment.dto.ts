import { ApiPropertyOptional } from '@nestjs/swagger';

export class EquipmentListQueryDto {
  @ApiPropertyOptional({ description: '页码，从 1 开始', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: '设备名称或编号（模糊匹配）' })
  name?: string;

  @ApiPropertyOptional({ description: '负责人姓名（模糊匹配）' })
  person?: string;
}
