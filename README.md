# 朋远智慧园区管理平台（全栈版）

[![CI](https://github.com/XiyuanFan/Smart-Park-Management-System/actions/workflows/ci.yml/badge.svg)](https://github.com/XiyuanFan/Smart-Park-Management-System/actions/workflows/ci.yml)

一个前后端分离的智慧园区中后台系统。

## 技术栈

- **前端**：React 18 + TypeScript + Ant Design 5 + Redux Toolkit + React Router 6 + axios + ECharts（Create React App 脚手架）
- **后端**：Node.js 20 + **NestJS 12** + TypeScript 6 + Prisma 5 + MySQL 8 + JWT 鉴权 + Swagger 接口文档
- **数据库**：MySQL 8.0，库名 `smart_park`，字符集 `utf8mb4`

## 快速启动

开**两个终端**，先起后端再起前端。

### 第一步：准备数据库

```bash
mysql -u root -p -h 127.0.0.1 -P 3305 -e "CREATE DATABASE IF NOT EXISTS smart_park DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

> 本机 MySQL 官方安装版监听在 **3305** 端口（3306 上是另一个 `D:\mysql` 实例，密码不同）。
> 连不上时先用 `netstat -ano | findstr 3305` 确认端口。

### 第二步：启动后端

```bash
cd server
npm install
copy .env.example .env      # Windows；macOS/Linux 用 cp
# 然后编辑 .env，填上真实数据库密码
npx prisma db push          # 按 schema 建表
npx prisma generate         # 生成 Prisma 客户端
npm run db:seed             # 灌入种子数据
npm run dev                 # 启动在 http://localhost:3001
```

启动后可访问：

- 健康检查：<http://localhost:3001/health>
- **Swagger 接口文档**：<http://localhost:3001/api-docs>（可直接在页面上调试所有接口）

### 第三步：启动前端

```bash
# 回到仓库根目录
npm install
npm start                   # 启动在 http://localhost:3000
```

浏览器打开 <http://localhost:3000>，用 `admin` / `admin123123` 登录。

## 登录账号

| 账号 | 密码 | 角色 | 可访问菜单路径数 |
|---|---|---|---|
| admin | admin123123 | 管理员 | 23 |
| manager | manager123123 | 园区经理 | 19 |
| user | user123123 | 普通员工 | 13 |
| user02 | user02123 | 自定义用户 | 10 |

## 项目结构

```
├─ src/              前端（React SPA）
│  ├─ router/        静态路由壳 + 路径到组件的映射
│  ├─ utils/         动态路由生成、鉴权守卫、axios 封装
│  ├─ store/         Redux Toolkit（登录态、菜单、业务缓存）
│  └─ mock/          原 Mock.js 假数据层（已停用，保留备查）
└─ server/           后端（NestJS + Prisma）
   ├─ prisma/        数据模型与种子数据
   └─ src/           按业务模块划分：auth / menu / tenant / equipment /
                     estate / finance / energy / account / chat / health
```

## 动态路由是怎么工作的

这是本项目最核心的设计，也是面试里最值得讲的部分：

1. 登录成功，后端签发 JWT，前端把 token 存进 Redux **和** sessionStorage
2. `App.tsx` 的 `useEffect` 依赖 token，token 一变就重新请求 `/menu`
3. 后端按 token 里的角色，从 `sys_menu` 表查出该角色的菜单树返回
4. `utils/generatesRoutes.tsx` 递归把菜单树翻译成路由数组，再交给 `createBrowserRouter`
5. 左侧菜单、页面访问、面包屑全部由这同一棵树驱动

所以**不同角色登录后，菜单和可访问路由都不一样**。

> 需要留意的一点：真正"动态"的只是**路径集合**，「路径 → 组件」的映射是静态写在
> `src/router/routerMap.tsx` 里的；而且 `RequireAuth` 只校验"有没有 token"，
> 不校验 token 属于哪个角色。页面级角色权限目前是靠菜单树"隐藏入口"实现的。

## 文档

- 后端详细说明：[server/README.md](./server/README.md)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

codex resume 019df688-c860-7372-a393-119d0d729231

 1. 先从“项目跑起来 + 点一遍功能”开始
     用 admin / admin123123 登录，把左侧菜单都点一遍。你不需要先懂代码，先建立“页面地图”。
     重点记住：

  - 这是个智慧园区中后台
  - 核心模块有：仪表盘、用户管理、物业、合同账单、设备、系统设置
  - 最大特点是：菜单和路由不是写死的，而是登录后动态生成

  2. 再看“入口链路”，只搞懂项目怎么启动
     按这个顺序看：

  - src/index.tsx
  - src/App.tsx
  - src/router/index.tsx

  你要回答的问题只有 3 个：

  - 项目从哪里启动
  - 登录后为什么能进后台
  - 路由是静态的还是动态的

  3. 第一个重点攻克“登录 + 鉴权 + 动态路由”
     这是这个项目最值得讲的部分，优先级最高。继续看：

  - src/api/users.ts
  - src/store/login/authSlice.ts
  - src/utils/RequireAuth.tsx
  - src/router/routerMap.tsx
  - src/utils/generatesRoutes.tsx
  - src/mock/index.ts

  你要彻底弄明白这条链：

  - 登录成功
  - token 存进 sessionStorage 和 Redux
  - 再请求菜单接口
  - 根据菜单树递归生成路由
  - 左侧菜单、页面访问、面包屑都跟菜单关联起来

  如果这块讲明白，你的项目含金量就已经起来了。

  4. 第二个重点看“后台整体布局怎么组织”
     看这几个文件：

  - src/page/home/index.tsx
  - src/components/navLeft/index.tsx
  - src/components/header/index.tsx
  - src/components/breadCrumb/index.tsx

  你只需要搞懂：

  - 后台页面的公共壳子在哪
  - 左侧菜单怎么根据 menuList 渲染
  - 面包屑怎么根据当前路径生成

  5. 第三个重点选一个“最完整的业务模块”精读
     我建议你先读“用户管理”，因为它最像真实中后台业务。
     看：

  - src/page/users/index.tsx
  - src/page/users/userForm.tsx
  - src/api/userList.ts
  - src/store/user/userSlice.ts

  你要看懂：

  - 查询条件怎么绑定
  - 表格数据怎么请求
  - 分页怎么做
  - 单删/批删怎么做
  - 编辑弹窗怎么打开
  - 为什么要把编辑数据临时放进 Redux

  只要这个模块你能从头讲到尾，面试里就够用了。

  6. 再补一个“可复用/有亮点”的能力点
     我建议你看这两个方向，至少拿下一个：

  - 通用列表 Hook
    看 src/hooks/useDataList.ts 和 src/page/equipment/index.tsx
  - 合同列表状态缓存
    看 src/page/finance/contract.tsx、src/page/finance/surrender.tsx、src/store/finance/contractSlice.ts

  这两块很适合讲“抽象能力”和“用户体验优化”。

  7. 最后补“请求层”和“工程组织”
     看：

  - src/utils/http/http.ts
  - src/utils/http/request.ts
  - src/store/index.ts

  你只要理解：

  - 为什么要封装 Axios
  - token 是怎么自动带上的
  - Redux 里分了哪些 slice
  - 为什么中后台项目适合这样分层