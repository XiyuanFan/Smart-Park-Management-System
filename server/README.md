# 智慧园区管理系统 - 后端服务

Express + TypeScript + Prisma + MySQL 实现的后端服务，用于替换前端原本的 Mock.js 假数据层。

## 技术栈

| 项 | 选型 |
|---|---|
| 运行时 | Node.js 20 |
| Web 框架 | Express 4 |
| 语言 | TypeScript 5（`tsx` 直跑，无需先编译） |
| ORM | Prisma 5 |
| 数据库 | MySQL 8.0 |
| 鉴权 | JWT（`jsonwebtoken`）+ bcrypt 密码哈希 |

## 目录结构

```
server/
├─ prisma/
│  ├─ schema.prisma      数据模型定义
│  └─ seed.ts            种子数据（把原 mock 数据落库）
├─ src/
│  ├─ index.ts           服务入口、CORS、全局错误处理
│  ├─ lib/
│  │  ├─ prisma.ts       PrismaClient 单例
│  │  ├─ jwt.ts          token 签发与校验
│  │  ├─ menu.ts         菜单树组装、角色名映射
│  │  ├─ response.ts     统一响应体
│  │  └─ asyncHandler.ts 异步路由异常捕获
│  ├─ middleware/
│  │  └─ auth.ts         Bearer token 鉴权
│  └─ routes/
│     ├─ index.ts        路由汇总与鉴权挂载
│     ├─ auth.ts         /login /menu
│     ├─ tenant.ts       租户增删改查
│     ├─ equipment.ts    设备台账
│     ├─ estate.ts       房间
│     ├─ finance.ts      合同、账单
│     ├─ energy.ts       能耗曲线
│     ├─ account.ts      账号与权限
│     └─ chat.ts         私聊
└─ .env                  数据库连接、JWT 密钥（不要提交）
```

## 快速开始

### 1. 前置条件

- Node.js ≥ 18（本项目用 20.20.2 验证）
- MySQL 8.0 已启动

> **本机注意**：这台机器上跑了两个 MySQL 实例。官方安装版（`C:\Program Files\MySQL\MySQL Server 8.0`）监听在 **3305**，
> `D:\mysql` 那个实例监听在 **3306**。本项目用的是 **3305** 这个。
> 用命令行连库时一定要带 `-P 3305`，否则默认会连到 3306 那个密码不同的实例。

### 2. 配置连接信息

```bash
cd server
cp .env.example .env   # Windows: copy .env.example .env
```

然后按实际情况修改 `.env`：

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
# 建库（也可以用 MySQL 客户端手动执行）
mysql -u root -p -h 127.0.0.1 -P 3305 -e "CREATE DATABASE IF NOT EXISTS smart_park DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 按 schema 建表
npx prisma db push

# 生成客户端
npx prisma generate

# 灌入种子数据
npm run db:seed
```

### 5. 启动服务

```bash
npm run dev
```

启动后访问 <http://localhost:3001/health> 应返回 `{"code":200,...}`。

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

所有接口统一返回 `{ code, message, data }`。**HTTP 状态码恒为 200**，业务状态放在 `code` 里
（原因见 `src/lib/response.ts` 的注释：前端 `http.ts` 只在成功分支判断 `code`，没有错误拦截器）。

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

鉴权方式：请求头 `Authorization: Bearer <token>`，前端 axios 拦截器会自动携带。

## 与原 Mock 的差异

改造过程中发现并修正了原 mock 的几个问题，这些都属于"真后端才能暴露"的：

1. **`/equipmentList` 从未实现**。前端 `src/page/equipment/index.tsx` 一直在调用它，
   但 `mock/index.ts` 里没有对应定义，所以设备管理页此前拿不到数据。现已补上。
2. **列表筛选条件被忽略**。原 mock 收到 `companyName/contact/phone`、`contractNo/person/tel`
   等查询参数后直接丢弃，只返回随机数据；现在全部落成真实 SQL `WHERE` 条件。
3. **编辑接口是空操作**。原 mock 的 `/editUser` 只是 `console.log` 后返回成功。
   根本原因是前端表单里没有 `id` 字段，编辑时无法定位记录 —— 已在
   `src/page/users/userForm.tsx` 中补上从 Redux 取 `userData.id` 一并提交。
4. **密码明文存储**。mock 里是明文比较，现改为 bcrypt 哈希后存库。
5. **token 是假字符串**。原 mock 用 `mocktoken123456admin` 这种固定串，
   现改为带过期时间的真实 JWT，并由服务端中间件校验。

## 常用命令

```bash
npm run dev          # 开发模式（热重载）
npm run build        # 编译到 dist/
npm start            # 运行编译产物
npm run db:push      # 同步 schema 到数据库
npm run db:seed      # 重新灌入种子数据（会先清空）
npm run db:studio    # 打开 Prisma Studio 可视化查看数据
npm run db:reset     # 重置数据库并重新 seed
```

## 常见问题

**连不上数据库**
先确认端口：`netstat -ano | findstr 3305`。如果你本机数据库在 3306，改 `.env` 里的端口即可。

**中文乱码**
建库时必须指定 `utf8mb4`。用命令行客户端查询时带上 `--default-character-set=utf8mb4`。
注意：用 PowerShell 的 `Invoke-RestMethod` 发中文请求体时，若不显式指定 charset，
PowerShell 会按 ASCII 编码导致中文变成 `?`，这是客户端行为，浏览器里 axios 不受影响。

**`/login` 返回 400「请求体格式有误」**
说明请求体不是合法 JSON，检查发送端是否正确设置了 `Content-Type: application/json`。
