import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: '接收人账号（accountName）', example: 'manager' })
  to: string;

  @ApiProperty({ description: '消息内容', example: '今天园区能耗报表帮我看一下。' })
  content: string;
}

export class SaveMessageDto {
  @ApiProperty({ description: '消息 id', example: 'admin-manager-1730000000000' })
  id: string;

  @ApiProperty({ description: '发送人账号', example: 'admin' })
  from: string;

  @ApiProperty({ description: '接收人账号', example: 'manager' })
  to: string;

  @ApiProperty({ description: '消息内容' })
  content: string;

  @ApiPropertyOptional({ description: '展示时间 HH:mm，不传则由服务端生成' })
  time?: string;
}

export class ChatMessagesQueryDto {
  @ApiProperty({ description: '对方的账号（accountName）', example: 'manager' })
  friendId: string;
}
