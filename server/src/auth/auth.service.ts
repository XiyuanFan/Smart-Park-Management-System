import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { MenuService } from '../menu/menu.service';
import type { MenuNode } from '../menu/types/menu-node';
import type { LoginDto } from './dto/login.dto';
import type { TokenPayload } from './types/token-payload';

export interface LoginResult {
  username: string;
  accountName: string;
  token: string;
  btnAuth: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly menuService: MenuService
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    // 没有启用全局 ValidationPipe，这里做一次显式的基础校验
    if (!dto?.username || !dto?.password) {
      throw new BadRequestException('用户名和密码不能为空');
    }

    const account = await this.prisma.account.findUnique({
      where: { accountName: String(dto.username) },
    });

    // 账号不存在与密码错误返回同一提示，避免账号枚举
    if (!account || !bcrypt.compareSync(String(dto.password), account.password)) {
      throw new UnauthorizedException('用户名或密码有误');
    }

    const payload: TokenPayload = {
      accountName: account.accountName,
      role: account.role,
      person: account.person,
    };

    return {
      username: account.person,
      accountName: account.accountName,
      token: await this.jwtService.signAsync(payload),
      btnAuth: Array.isArray(account.btnAuth) ? (account.btnAuth as string[]) : [],
    };
  }

  getMenuByRole(role: string): Promise<MenuNode[]> {
    return this.menuService.getTreeByRole(role);
  }
}
