import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuService } from '../menu/menu.service';
import type { MenuNode } from '../menu/types/menu-node';

export interface AccountItem {
  id: number;
  accountName: string;
  auth: string;
  person: string;
  tel: string;
  department: string;
  menu: MenuNode[];
}

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly menuService: MenuService
  ) {}

  /** 账号管理列表：每个账号附带「它所属角色能看到的那棵菜单树」 */
  async list(): Promise<{ list: AccountItem[]; total: number }> {
    const accounts = await this.prisma.account.findMany({ orderBy: { id: 'asc' } });

    // 角色数量很少，按角色缓存菜单树，避免同一角色重复查库
    const menuCache = new Map<string, MenuNode[]>();
    const getMenu = async (role: string): Promise<MenuNode[]> => {
      let cached = menuCache.get(role);
      if (!cached) {
        cached = await this.menuService.getTreeByRole(role);
        menuCache.set(role, cached);
      }
      return cached;
    };

    const list: AccountItem[] = [];
    for (const account of accounts) {
      list.push({
        id: account.id,
        accountName: account.accountName,
        auth: account.role,
        person: account.person,
        tel: account.tel,
        department: account.department,
        menu: await getMenu(account.role),
      });
    }

    return { list, total: list.length };
  }
}
