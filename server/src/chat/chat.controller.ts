import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import type { TokenPayload } from '../auth/types/token-payload';
import { ChatService } from './chat.service';
import { SaveMessageDto, SendMessageDto } from './dto/chat.dto';

@ApiTags('内部私聊')
@ApiBearerAuth()
@Controller('chat/v2')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('staff')
  @ApiOperation({ summary: '通联列表', description: '返回除当前登录账号以外的所有同事' })
  listStaff(@CurrentUser() user: TokenPayload) {
    return this.chatService.listStaff(user.accountName);
  }

  @Get('messages')
  @ApiParam({ name: 'friendId', description: '对方账号' })
  @ApiOperation({ summary: '聊天记录', description: '取当前用户与 friendId 的双向消息，按时间正序' })
  listMessages(
    @CurrentUser() user: TokenPayload,
    @Query('friendId') friendId: string
  ) {
    return this.chatService.listMessages(user.accountName, friendId ?? '');
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('发送成功')
  @ApiOperation({ summary: '发送消息', description: '发送方取自 JWT，前端只需传 to 与 content' })
  send(@CurrentUser() user: TokenPayload, @Body() dto: SendMessageDto) {
    return this.chatService.send(user.accountName, dto);
  }

  @Post('save')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('保存成功')
  @ApiOperation({ summary: '消息回写', description: '按 id 幂等 upsert，用于前端乐观更新后的落库' })
  save(@Body() dto: SaveMessageDto) {
    return this.chatService.save(dto);
  }
}
