import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 标记为 @Global，业务模块无需重复 import 即可注入 PrismaService。
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
