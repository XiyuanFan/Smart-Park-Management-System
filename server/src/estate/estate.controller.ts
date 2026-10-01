import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { RoomListQueryDto } from './dto/estate.dto';
import { EstateService } from './estate.service';

@ApiTags('物业管理')
@ApiBearerAuth()
@Controller()
export class EstateController {
  constructor(private readonly estateService: EstateService) {}

  @Post('roomList')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({
    summary: '按楼栋查询房间列表',
    description: '返回结构为 { rooms: [...] }，与前端页面解构方式保持一致',
  })
  listRooms(@Body() dto: RoomListQueryDto) {
    return this.estateService.listRooms(dto);
  }
}
