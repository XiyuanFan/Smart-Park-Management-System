import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { EquipmentListQueryDto } from './dto/equipment.dto';
import { EquipmentService } from './equipment.service';

@ApiTags('设备管理')
@ApiBearerAuth()
@Controller()
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post('equipmentList')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({
    summary: '设备台账分页列表',
    description: '原 mock 中缺失的接口，本次由真实后端补齐',
  })
  list(@Body() query: EquipmentListQueryDto) {
    return this.equipmentService.list(query);
  }
}
