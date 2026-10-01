import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AuthService, type LoginResult } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { TokenPayload } from './types/token-payload';
import type { MenuNode } from '../menu/types/menu-node';

@ApiTags('认证与权限')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  // 统一使用 200 作为成功状态码，与响应体里的 code 保持一致
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('登录成功')
  @ApiOperation({
    summary: '登录',
    description: '校验账号密码（bcrypt），成功后签发 JWT 并返回按钮级权限',
  })
  @ApiOkResponse({ description: '登录成功，返回 token 与 btnAuth' })
  login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.authService.login(dto);
  }

  @Get('menu')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取当前用户的菜单树',
    description: '按 JWT 中的角色从 sys_menu 表查询并组装成树，供前端生成动态路由',
  })
  @ApiOkResponse({ description: '菜单树' })
  getMenu(@CurrentUser() user: TokenPayload): Promise<MenuNode[]> {
    return this.authService.getMenuByRole(user.role);
  }
}
