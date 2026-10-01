import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AccountService } from './account.service';

@ApiTags('账号管理')
@ApiBearerAuth()
@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('accountList')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({
    summary: '账号列表（含各账号的菜单权限树）',
    description: '用于系统设置页预览某个账号能看到哪些菜单',
  })
  list() {
    return this.accountService.list();
  }
}
