import { ApiProperty } from '@nestjs/swagger';

export class RoomListQueryDto {
  @ApiProperty({
    description: '楼栋标识，例如 a1 / b2 / c1 / d1',
    example: 'a1',
  })
  roomid: string;
}
