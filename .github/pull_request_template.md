<!-- 提交 PR 时请把不适用的章节删掉，保持描述简洁 -->

## 变更内容

<!-- 这个 PR 做了什么？为什么这么做？ -->

## 变更类型

- [ ] 新功能 feature
- [ ] 缺陷修复 bugfix
- [ ] 重构 refactor
- [ ] 文档 docs
- [ ] 工程 / 构建 chore

## 影响范围

- [ ] 前端 `src/`
- [ ] 后端 `server/`
- [ ] 数据库 schema / 种子数据
- [ ] 仅文档

## 自查清单

- [ ] 后端 `cd server && npm run typecheck` 通过
- [ ] 后端 `cd server && npm run build` 通过
- [ ] 前端 `npx tsc --noEmit` 通过
- [ ] 前端 `CI=true npm run build` 通过（0 个 ESLint 警告）
- [ ] 本地接口自测通过
- [ ] **没有**提交 `.env`、`node_modules`、`dist/`、日志等文件
- [ ] 若改了数据库结构，已同步更新 `prisma/schema.prisma` 与 `prisma/seed.ts`
- [ ] 若改了接口，已在 Swagger 注释 / DTO 中同步反映

## 关联 Issue

<!-- 例如：Closes #12 -->

## 补充说明

<!-- 截图、验证方式、破坏性变更、需要 reviewer 重点关注的地方 -->
