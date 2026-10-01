import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '登录账号（4-12 位字母、数字或下划线）',
    example: 'admin',
  })
  username: string;

  @ApiProperty({ description: '登录密码', example: 'admin123123' })
  password: string;
}
