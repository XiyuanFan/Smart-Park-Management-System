# 智慧园区管理系统 - 后端服务

**NestJS 12** + TypeScript 6 + Prisma 5 + MySQL 8 实现的后端服务，用于替换前端原本的 Mock.js 假数据层。

## 技术栈

| 项 | 选型 |
|---|---|
| 运行时 | Node.js 20（NestJS 12 要求 Node ≥ 20） |
| Web 框架 | NestJS 12（底层为 Express 5） |
| 语言 | TypeScript 6 |
| ORM | Prisma 5 |
| 数据库 | MySQL 8.0（utf8mb4） |
| 鉴权 | JWT（`@nestjs/jwt`）+ bcrypt 密码哈希 |
| 文档 | Swagger（`@nestjs/swagger`） |
| 缓存 | `@nestjs/cache-manager` + `cache-manager` v7（进程内内存 store） |

## 目录结构

```
server/
├─ prisma/
│  ├─ schema.prisma         数据模型定义（9 张表）
│  └─ seed.ts               种子数据（把原 mock 数据落库）
├─ src/
│  ├─ main.ts               入口：CORS、Swagger、启动日志
│  ├─ app.module.ts         根模块，注册全局 Guard/Interceptor/Filter
│  ├─ prisma/               PrismaService（PrismaClient 的可注入包装）
│  ├─ common/
│  │  ├─ decorators/        @Public / @ResponseMessage / @CurrentUser
│  │  ├─ interceptors/      TransformInterceptor（统一成功响应）
│  │  ├─ filters/           AllExceptionsFilter（统一失败响应）
│  │  ├─ types/             ApiResponse
│  │  └─ utils/             toStr / toNum
│  ├─ auth/                 登录、菜单、AuthGuard、LoginDto
│  ├─ menu/                 MenuService（按角色组装菜单树）
│  ├─ health/               健康检查
│  ├─ tenant/               租户（列表/删除/批量删除/新增编辑）
│  ├─ equipment/            设备台账
│  ├─ estate/               房间
│  ├─ finance/              合同、账单
│  ├─ energy/               能耗曲线
│  ├─ account/              账号与菜单权限
│  └─ chat/                 内部私聊
└─ .env                     数据库连接、JWT 密钥（不要提交）
```

## 快速开始

### 1. 前置条件

- Node.js ≥ 20（本项目用 20.20.2 验证）
- MySQL 8.0 已启动

> **本机注意**：这台机器上跑了两个 MySQL 实例。官方安装版（`C:\Program Files\MySQL\MySQL Server 8.0`）监听在 **3305**，
> `D:\mysql` 那个实例监听在 **3306**。本项目用的是 **3305** 这个。
> 用命令行连库时一定要带 `-P 3305`，否则默认会连到 3306 那个密码不同的实例。

### 2. 配置连接信息

```bash
cd server
cp .env.example .env   # Windows: copy .env.example .env
```

按实际情况修改 `.env`：

```ini
DATABASE_URL="mysql://root:你的密码@127.0.0.1:3305/smart_park"
JWT_SECRET="换成一个足够随机的长字符串"
JWT_EXPIRES_IN="2h"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 3. 安装依赖

```bash
npm install
```

### 4. 初始化数据库

```bash
mysql -u root -p -h 127.0.0.1 -P 3305 -e "CREATE DATABASE IF NOT EXISTS smart_park DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
npx prisma db push      # 按 schema 建表
npx prisma generate     # 生成客户端
npm run db:seed         # 灌入种子数据
```

### 5. 启动服务

```bash
npm run dev             # watch 模式，改代码自动重启
```

| 地址 | 说明 |
|---|---|
| <http://localhost:3001/health> | 健康检查 |
| <http://localhost:3001/api-docs> | **Swagger 交互式接口文档** |

## 可用账号

密码在数据库中以 bcrypt 存储，种子数据里的明文如下：

| 账号 | 密码 | 角色 | 菜单路径数 |
|---|---|---|---|
| admin | admin123123 | admin | 23 |
| manager | manager123123 | manager | 19 |
| user | user123123 | user | 13 |
| user02 | user02123 | customize | 10 |

角色不同 → `/menu` 返回的菜单树不同 → 前端动态生成的路由也不同。

## 接口清单

| 方法 | 路径 | 说明 | 需鉴权 |
|---|---|---|---|
| POST | `/login` | 登录，返回 JWT 与按钮权限 | 否 |
| GET | `/menu` | 按角色返回菜单树 | 是 |
| POST | `/userList` | 租户分页列表 | 是 |
| POST | `/deleteUser` | 删除单个租户 | 是 |
| POST | `/batchDeleteUser` | 批量删除租户 | 是 |
| POST | `/editUser` | 新增/编辑租户（带 id 即更新） | 是 |
| POST | `/equipmentList` | 设备分页列表 | 是 |
| POST | `/roomList` | 按楼栋查房间 | 是 |
| POST | `/contractList` | 合同分页列表 | 是 |
| POST | `/billList` | 账单分页列表 | 是 |
| GET | `/energyData` | 能耗曲线（echarts series） | 是 |
| POST | `/accountList` | 账号列表（含各账号菜单树） | 是 |
| GET | `/chat/v2/staff` | 通联列表 | 是 |
| GET | `/chat/v2/messages` | 与某人的聊天记录 | 是 |
| POST | `/chat/v2/send` | 发送消息 | 是 |
| POST | `/chat/v2/save` | 消息回写（幂等 upsert） | 是 |
| GET | `/health` | 健康检查 | 否 |

## 响应约定

成功与失败使用同一套结构，区别在 HTTP 状态码：

```jsonc
// 成功：HTTP 200
{ "code": 200, "message": "请求成功", "data": { /* ... */ } }

// 失败：HTTP 401 / 400 / 404 / 500 ...
{ "code": 401, "message": "登录已失效，请重新登录", "data": null }
```

这一套由两个全局组件实现：

- `TransformInterceptor` —— 把 controller 的返回值包装成成功响应
- `AllExceptionsFilter` —— 把异常统一成失败响应，并映射为真实 HTTP 状态码

> **重要**：这套约定要求前端在 axios 的**失败分支**里取 `error.response.data.message`。
> 见 `src/utils/http/http.ts` 的响应拦截器。

## 架构说明

### 全局组件为什么用 `APP_*` 注册

`app.module.ts` 里这样注册：

```ts
providers: [
  { provide: APP_GUARD, useClass: AuthGuard },
  { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
]
```

如果改用 `app.useGlobalGuards(new AuthGuard())` 这种手动实例化方式，
`AuthGuard` 就拿不到 `Reflector` 和 `JwtService`，`@Public()` 装饰器也会失效。

### 鉴权流程

1. `AuthGuard` 是全局守卫，先查 `@Public()` 元数据，命中则放行（`/login`、`/health`）
2. 否则读取 `Authorization: Bearer <token>`，用 `JwtService.verifyAsync` 校验
3. 校验通过把载荷挂到 `request.user`，控制器里用 `@CurrentUser()` 取出
4. 失败抛 `UnauthorizedException` → `AllExceptionsFilter` → HTTP 401

### 为什么没有启用 ValidationPipe

`class-validator` / `class-transformer` 作为 `@nestjs/common` 的 peerDependency 已安装，
DTO 类主要给 Swagger 提供 schema。但**没有**注册全局 `ValidationPipe`，
参数校验仍是 Service 里的显式判断（如 `if (!data.name) throw new BadRequestException(...)`）。

想改成声明式校验，只需两步：

```ts
// main.ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

// dto 里加装饰器
@IsNotEmpty({ message: '客户名称不能为空' })
name: string;
```

## 缓存策略

使用 `@nestjs/cache-manager` + `cache-manager` v7 的**进程内内存缓存**，在 `app.module.ts` 中全局注册：

```ts
CacheModule.register({ isGlobal: true, ttl: 5 * 60 * 1000 })
```

> 注意两个 v7 的坑：不传 `stores` 时会使用 Keyv 的默认内存 store；
> 并且 **v7 已移除旧版的 `max` 选项**（不要照抄 v5 的文档）。

目前只缓存了两个「读极多、写极少」的接口：

| 接口 | 缓存 key | TTL |
|---|---|---|
| `GET /menu` | `menu:role:<角色>` | 5 分钟 |
| `GET /energyData` | `energy:series` | 10 分钟 |

**为什么 `/menu` 不用 `CacheInterceptor`？**

`CacheInterceptor` 是按 **URL** 缓存的，而 `/menu` 对所有角色是同一个 URL、响应内容却不同。
按 URL 缓存会把 A 角色的菜单返回给 B 角色 —— 这是权限泄漏。
所以 `MenuService` 里手动以 `role` 拼 key。

**为什么不缓存列表接口**：`/userList`、`/contractList` 等带分页与筛选条件，
每次请求的 key 都不同，命中率极低，缓存只会白占内存。

**失效入口**：`MenuService.invalidate(role?)` 与 `EnergyService.invalidate()`。
当前项目还没有「修改菜单 / 角色权限」的写接口，这两个方法是给将来预留的 ——
换句话说，**缓存一致性这个真正的难点在这个项目里还体现不出来**，面试时不必硬吹。

命中情况可在启动日志中观察（`main.ts` 已打开 `debug` 级别）：

```
[MenuService]  菜单缓存写入: menu:role:admin (12 个顶级菜单)
[MenuService]  菜单缓存命中: menu:role:admin
[EnergyService] 能耗缓存写入: energy:series (5 条曲线)
[EnergyService] 能耗缓存命中: energy:series
```

## 从 Express 迁移过来的说明

`server/` 目录在 2026-10 从 Express 4 原地重塑为 NestJS 12。旧版本完整保留在 git 里：

```bash
git checkout legacy/express-backend   # 分支
git show v1.0-express                 # 标签
```

迁移过程中修正了原 mock 的 5 个问题：

1. **`/equipmentList` 从未实现** —— 前端 `src/page/equipment/index.tsx` 一直在调用它，
   但 `mock/index.ts` 里没有对应定义，设备管理页此前拿不到数据。现已补上。
2. **列表筛选条件被忽略** —— 原 mock 收到查询参数后直接丢弃只返回随机数据；现已全部落成真实 SQL `WHERE`。
3. **编辑接口是空操作** —— 根因是前端表单没有 `id` 字段，已在 `src/page/users/userForm.tsx` 补上。
4. **密码明文存储** —— 改为 bcrypt 哈希。
5. **token 是固定假字符串** —— 改为带过期时间的真实 JWT，由 AuthGuard 校验。

## 常用命令

```bash
npm run dev          # watch 模式启动
npm run build        # 编译到 dist/
npm run start:prod   # 运行编译产物（node dist/main.js）
npm run typecheck    # 只做类型检查
npm run db:push      # 同步 schema 到数据库
npm run db:seed      # 重新灌入种子数据（会先清空）
npm run db:studio    # Prisma Studio 可视化查看数据
```

## 常见问题

**连不上数据库**
先确认端口：`netstat -ano | findstr 3305`。如果本机数据库在 3306，改 `.env` 里的端口即可。

**`nest start` 报 TS5011 / TS5101 之类的错误**
本项目用的是 TypeScript 6。TS 6 起要求显式设置 `rootDir`，并且弃用了 `baseUrl`，
这些都已在 `tsconfig.build.json` / `tsconfig.json` 里处理。升级 TS 主版本时请留意 `https://aka.ms/ts6`。

**npm install 报 EBADENGINE 警告**
`@nestjs/cli` 的传递依赖 `commander@15` 声明要求 Node ≥ 22，
但在 Node 20.20.2 上实测 CLI 功能正常（`npx nest --version` 可用）。属于警告，可忽略。

**中文乱码**
建库时必须指定 `utf8mb4`。用命令行客户端查询时带上 `--default-character-set=utf8mb4`。
注意：用 PowerShell 的 `Invoke-RestMethod` 发中文请求体时，若不显式指定 charset，
PowerShell 会按 ASCII 编码导致中文变成 `?`。**这是客户端行为**，浏览器里 axios 不受影响。
测试时可用：`-Body ([System.Text.Encoding]::UTF8.GetBytes($json))`。
