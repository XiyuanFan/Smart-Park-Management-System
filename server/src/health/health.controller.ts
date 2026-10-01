import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('系统')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ResponseMessage('ok')
  @ApiOperation({ summary: '健康检查', description: '用于确认服务是否已正常启动，无需鉴权' })
  check() {
    return { uptime: process.uptime(), timestamp: Date.now() };
  }
}
