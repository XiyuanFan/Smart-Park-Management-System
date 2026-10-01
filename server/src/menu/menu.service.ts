import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import type { MenuNode } from './types/menu-node';

/** 角色 -> 中文名，用于 /chat/v2/staff 与 /accountList 的展示 */
export const ROLE_NAME_MAP: Record<string, string> = {
  admin: '管理员',
  manager: '经理',
  user: '普通员工',
  customize: '自定义用户',
};

/** 菜单缓存 5 分钟：菜单是「读极多、写极少」的数据 */
const MENU_CACHE_TTL_MS = 5 * 60 * 1000;
const MENU_CACHE_PREFIX = 'menu:role:';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  /**
   * 按角色取菜单树，带缓存。
   *
   * 注意：**不能用 CacheInterceptor 按 URL 缓存**。
   * /menu 对所有角色是同一个 URL，但响应内容因角色而异，
   * 按 URL 缓存会把 A 角色的菜单返回给 B 角色，属于权限泄漏。
   * 所以这里手动以 role 拼 key。
   */
  async getTreeByRole(role: string): Promise<MenuNode[]> {
    const key = `${MENU_CACHE_PREFIX}${role}`;

    const cached = await this.cache.get<MenuNode[]>(key);
    if (cached) {
      this.logger.debug(`菜单缓存命中: ${key}`);
      return cached;
    }

    const tree = await this.buildTree(role);
    await this.cache.set(key, tree, MENU_CACHE_TTL_MS);
    this.logger.debug(`菜单缓存写入: ${key} (${tree.length} 个顶级菜单)`);
    return tree;
  }

  /**
   * 菜单或角色权限发生变更后调用。
   * 不传 role 则清空全部菜单缓存。
   *
   * 说明：当前项目还没有「修改菜单/角色」的写接口，
   * 这个方法是给将来加该类接口时预留的失效入口。
   */
  async invalidate(role?: string): Promise<void> {
    if (role) {
      await this.cache.del(`${MENU_CACHE_PREFIX}${role}`);
      this.logger.debug(`菜单缓存失效: ${MENU_CACHE_PREFIX}${role}`);
      return;
    }
    await this.cache.clear();
    this.logger.debug('菜单缓存已全部清空');
  }

  /** 从数据库取出菜单行，在内存中组装成树（一次查询 + 一次遍历，不递归查库） */
  private async buildTree(role: string): Promise<MenuNode[]> {
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
