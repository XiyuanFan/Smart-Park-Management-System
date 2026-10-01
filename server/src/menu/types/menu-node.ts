/** 与前端 src/utils/generatesRoutes.tsx 的 MenuType 结构保持一致 */
export interface MenuNode {
  icon: string;
  label: string;
  key: string;
  children?: MenuNode[];
}
