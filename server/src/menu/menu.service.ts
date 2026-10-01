import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { MenuNode } from './types/menu-node';

/** 角色 -> 中文名，用于 /chat/v2/staff 与 /accountList 的展示 */
export const ROLE_NAME_MAP: Record<string, string> = {
  admin: '管理员',
  manager: '经理',
  user: '普通员工',
  customize: '自定义用户',
};

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 从数据库按角色取出菜单行，在内存中组装成树。
   * 数据量很小（几十行），一次查询 + 一次遍历即可，不必递归查库。
   */
  async getTreeByRole(role: string): Promise<MenuNode[]> {
    const rows = await this.prisma.menu.findMany({
      where: { role },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });

    const nodeMap = new Map<number, { parentId: number | null; node: MenuNode }>();
    for (const row of rows) {
      nodeMap.set(row.id, {
        parentId: row.parentId,
        node: { icon: row.icon, label: row.label, key: row.menuKey },
      });
    }

    const roots: MenuNode[] = [];
    for (const row of rows) {
      const entry = nodeMap.get(row.id);
      if (!entry) continue;

      if (row.parentId === null) {
        roots.push(entry.node);
        continue;
      }

      const parent = nodeMap.get(row.parentId);
      if (!parent) {
        // 父节点缺失时降级为顶级菜单，避免整棵子树在界面上凭空消失
        roots.push(entry.node);
        continue;
      }

      parent.node.children ??= [];
      parent.node.children.push(entry.node);
    }

    return roots;
  }
}
