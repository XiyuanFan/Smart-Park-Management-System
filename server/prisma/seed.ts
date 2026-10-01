/**
 * 种子数据脚本：把原前端 mock/index.ts 里的账号、菜单与业务数据真正落到 MySQL。
 *
 * 使用确定性伪随机数生成，保证每次执行得到同一批数据，方便前端联调与截图对比。
 * 脚本可重复执行：先按外键顺序清空，再重新写入。
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// 种子脚本是独立进程，不经过 NestJS 依赖注入，这里直接实例化客户端
const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/* 确定性随机工具                                                       */
/* ------------------------------------------------------------------ */

let seedState = 20261001;
function rnd(): number {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}
function int(min: number, max: number): number {
  return min + Math.floor(rnd() * (max - min + 1));
}
function digits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(rnd() * 10);
  return s;
}
function upperLetters(n: number): string {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < n; i++) s += A[Math.floor(rnd() * 26)];
  return s;
}
function mobile(): string {
  return pick(["13", "14", "15", "16", "17", "18", "19"]) + digits(9);
}

/* ------------------------------------------------------------------ */
/* 账号                                                                */
/* ------------------------------------------------------------------ */

const accounts = [
  { accountName: "admin", password: "admin123123", role: "admin", person: "赵铁柱", tel: "18888888888", department: "总裁办", btnAuth: ["add", "edit", "delete"], online: true },
  { accountName: "manager", password: "manager123123", role: "manager", person: "刘伟", tel: "16666666666", department: "财务部", btnAuth: ["add", "edit"], online: true },
  { accountName: "user", password: "user123123", role: "user", person: "王丽丽", tel: "17777777777", department: "网推部", btnAuth: ["add"], online: false },
  { accountName: "xuchao", password: "xuchao123", role: "admin", person: "徐超", tel: "18888888888", department: "总裁办", btnAuth: ["add", "edit", "delete"], online: true },
  { accountName: "user01", password: "user01123", role: "user", person: "王丽丽", tel: "17777777777", department: "网推部", btnAuth: ["add"], online: true },
  { accountName: "manager01", password: "manager01123", role: "manager", person: "刘伟", tel: "16666666666", department: "财务部", btnAuth: ["add", "edit"], online: false },
  { accountName: "user02", password: "user02123", role: "customize", person: "张安定", tel: "15555555555", department: "企划部", btnAuth: ["add"], online: true },
  { accountName: "laowang", password: "laowang123", role: "user", person: "王大大", tel: "14444444444", department: "总裁办", btnAuth: ["add"], online: false },
];

/* ------------------------------------------------------------------ */
/* 菜单                                                                */
/* ------------------------------------------------------------------ */

interface MenuSeed {
  key: string;
  label: string;
  icon: string;
  children?: { key: string; label: string; icon: string }[];
}

const CHAT_MENU: MenuSeed = { key: "/chat", label: "内部私聊", icon: "MessageOutlined" };

const dashboard: MenuSeed = { key: "/dashboard", label: "工作台", icon: "DashboardOutlined" };
const users: MenuSeed = {
  key: "/users",
  label: "租户管理",
  icon: "TeamOutlined",
  children: [
    { key: "/users/list", label: "租户列表", icon: "UnorderedListOutlined" },
    { key: "/users/add", label: "新增租户", icon: "UserAddOutlined" },
  ],
};
const estate: MenuSeed = {
  key: "/estate",
  label: "物业管理",
  icon: "LaptopOutlined",
  children: [
    { key: "/estate/tenement", label: "楼宇管理", icon: "InsertRowLeftOutlined" },
    { key: "/estate/room", label: "房间管理", icon: "BankOutlined" },
    { key: "/estate/car", label: "车辆信息", icon: "TruckOutlined" },
  ],
};
const repair: MenuSeed = { key: "/repair", label: "报修管理", icon: "ToolOutlined" };
const finance: MenuSeed = {
  key: "/finance",
  label: "财务管理",
  icon: "DollarOutlined",
  children: [
    { key: "/finance/contract", label: "合同管理", icon: "ProfileOutlined" },
    { key: "/finance/surrender", label: "合同详情", icon: "FrownOutlined" },
    { key: "/finance/bill", label: "账单管理", icon: "FileTextOutlined" },
  ],
};
const merchants: MenuSeed = { key: "/merchants", label: "招商管理", icon: "TransactionOutlined" };
const operation: MenuSeed = {
  key: "/operation",
  label: "运营管理",
  icon: "FundProjectionScreenOutlined",
  children: [
    { key: "/operation/all", label: "运营总览", icon: "FundViewOutlined" },
    { key: "/operation/article", label: "文章发布", icon: "ReadOutlined" },
    { key: "/operation/comments", label: "内容评论", icon: "CommentOutlined" },
  ],
};
const equipment: MenuSeed = { key: "/equipment", label: "设备管理", icon: "ToolOutlined" };
const energy: MenuSeed = { key: "/energy", label: "能源消耗", icon: "ThunderboltOutlined" };
const settings: MenuSeed = { key: "/settings", label: "系统设置", icon: "SettingOutlined" };
const personal: MenuSeed = { key: "/personal", label: "个人中心", icon: "UserOutlined" };

/**
 * 把「内部私聊」插到最后一个顶级菜单之前，
 * 与原 mock 里 withChatMenu() 的行为保持一致。
 */
function withChat(menu: MenuSeed[]): MenuSeed[] {
  if (menu.some((item) => item.key === CHAT_MENU.key)) return menu;
  return [...menu.slice(0, -1), CHAT_MENU, menu[menu.length - 1]];
}

const roleMenus: Record<string, MenuSeed[]> = {
  admin: withChat([
    dashboard, users, estate, repair, finance, merchants, operation,
    equipment, energy, settings, personal,
  ]),
  manager: withChat([
    dashboard, users, estate, repair, merchants, operation,
    equipment, energy, settings, personal,
  ]),
  user: withChat([
    dashboard, users, estate, repair, equipment, energy, personal,
  ]),
  customize: withChat([
    dashboard,
    { ...users, children: [users.children![0]] },
    { ...estate, children: [estate.children![0]] },
    repair, equipment, energy, personal,
  ]),
};

/* ------------------------------------------------------------------ */
/* 业务数据生成                                                        */
/* ------------------------------------------------------------------ */

const COMPANY_PREFIX = ["万物", "大鱼", "六六", "天明", "星河", "恒昌", "博远", "嘉禾", "安泰", "鼎盛", "云启", "中科", "汇通", "锦程", "启航", "聚力", "晨曦", "宏图", "瑞丰", "华信"];
const COMPANY_SUFFIX = ["科技", "网络科技", "信息技术", "物业管理", "新能源", "物流", "文化传媒", "电子商务", "智能制造", "环保工程"];
const BUSINESS = ["制造业", "互联网", "新媒体", "美业", "新能源", "物流", "电商"];
const PERSON = ["张伟", "王芳", "李强", "刘洋", "陈静", "杨帆", "赵敏", "黄磊", "周涛", "吴迪", "徐超", "孙丽", "马超", "朱琳", "胡军", "郭静", "何伟", "高原", "林峰", "郑爽"];

const BUILDINGS = ["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2"] as const;
const ROOM_IMG = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";

const CONTRACT_TYPE = ["租赁合同", "自定义合同", "购买合同"];
const CONTRACT_NAME = ["房屋租赁合同通用模版", "车位租赁合同通用模版", "商业房产买卖合同"];
const CONTRACT_JIA = ["万物科技有限公司", "大鱼网络科技", "六六信息技术有限公司"];
const CONTRACT_YI = "天明物业有限公司";
const CONTRACT_START = ["2023-01-01", "2023-03-05", "2023-04-01"];
const CONTRACT_END = ["2024-01-01", "2024-03-05", "2024-04-01"];

const BILL_ROOM = ["A1幢写字楼-201", "B1幢写字楼-402", "B2幢写字楼-701", "C2幢写字楼-1601"];
const BILL_CAR = ["B109", "C227", "C106", "D158"];
const BILL_COST1 = [1278.0, 2633.0, 3698.0];
const BILL_COST3 = ["25800/年", "19800/年"];
const BILL_PAY = ["微信", "支付宝", "现金", "银行卡转账"];

const EQUIPMENT_NAMES = ["客梯", "中央空调", "消防水泵", "高压配电柜", "柴油发电机", "新风机组", "监控主机", "门禁控制器", "给水泵", "冷却塔"];
const EQUIPMENT_TYPES = ["XV-2000", "KFR-72LW", "XBD-50", "GGD-1000", "SC-500", "XF-3000"];
const EQUIPMENT_FROM = ["上海三菱", "格力电器", "南方泵业", "正泰电气", "康明斯", "远大空调"];

/** 与 mock 完全一致的能源曲线 */
const ENERGY = [
  { name: "煤", series: [120, 132, 101, 134, 90, 230, 210] },
  { name: "气", series: [220, 182, 191, 234, 290, 330, 310] },
  { name: "油", series: [150, 232, 201, 154, 190, 330, 410] },
  { name: "电", series: [320, 332, 301, 334, 390, 330, 320] },
  { name: "热", series: [820, 932, 901, 934, 1290, 1330, 1320] },
];

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

async function clearAll() {
  // 按外键依赖顺序清理，保证脚本可重复执行
  await prisma.chatMessage.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.energyRecord.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.room.deleteMany();
  await prisma.tenant.deleteMany();
  // 菜单是自关联，先删子节点再删父节点
  await prisma.menu.deleteMany({ where: { parentId: { not: null } } });
  await prisma.menu.deleteMany();
  await prisma.account.deleteMany();
}

async function seedAccounts() {
  for (const item of accounts) {
    await prisma.account.create({
      data: {
        accountName: item.accountName,
        password: bcrypt.hashSync(item.password, 10),
        role: item.role,
        person: item.person,
        tel: item.tel,
        department: item.department,
        btnAuth: item.btnAuth,
        online: item.online,
      },
    });
  }
  console.log(`  ✓ 账号 ${accounts.length} 条（密码已 bcrypt 加密）`);
}

async function seedMenus() {
  let parentCount = 0;
  let childCount = 0;

  for (const [role, tree] of Object.entries(roleMenus)) {
    let sort = 0;
    for (const node of tree) {
      const parent = await prisma.menu.create({
        data: { role, menuKey: node.key, label: node.label, icon: node.icon, sort: sort++ },
      });
      parentCount++;

      if (node.children?.length) {
        let childSort = 0;
        for (const child of node.children) {
          await prisma.menu.create({
            data: {
              role,
              menuKey: child.key,
              label: child.label,
              icon: child.icon,
              parentId: parent.id,
              sort: childSort++,
            },
          });
          childCount++;
        }
      }
    }
  }
  console.log(`  ✓ 菜单 ${parentCount + childCount} 条（${parentCount} 个顶级 / ${childCount} 个子项，覆盖 4 个角色）`);
}

async function seedTenants() {
  const data = Array.from({ length: 78 }, (_, i) => ({
    name: `${COMPANY_PREFIX[i % COMPANY_PREFIX.length]}${COMPANY_SUFFIX[Math.floor(i / COMPANY_PREFIX.length) % COMPANY_SUFFIX.length]}有限公司`,
    status: pick(["1", "2", "3"]),
    tel: mobile(),
    business: pick(BUSINESS),
    email: `company${String(i + 1).padStart(3, "0")}@example.com`,
    creditCode: digits(18),
    industryNum: digits(15),
    organizationCode: upperLetters(9),
    legalPerson: pick(PERSON),
  }));

  await prisma.tenant.createMany({ data });
  console.log(`  ✓ 租户 ${data.length} 条`);
}

async function seedRooms() {
  const data: {
    building: string;
    roomNumber: number;
    decorationType: string;
    area: number;
    unitPrice: number;
    src: string;
  }[] = [];

  for (const building of BUILDINGS) {
    // 与原 mock 的 generateRooms() 保持同样的房间号编排：每 6 间一层
    for (let i = 0; i < 50; i++) {
      const floor = 1 + Math.floor(i / 6);
      data.push({
        building,
        roomNumber: floor * 100 + (101 + (i % 6)),
        decorationType: pick(["毛坯", "精装"]),
        area: int(70, 300),
        unitPrice: int(1, 3),
        src: ROOM_IMG,
      });
    }
  }

  await prisma.room.createMany({ data });
  console.log(`  ✓ 房间 ${data.length} 条（${BUILDINGS.length} 栋 × 50 间）`);
}

async function seedContracts() {
  const data = Array.from({ length: 54 }, (_, i) => ({
    contractNo: digits(6),
    type: pick(CONTRACT_TYPE),
    name: pick(CONTRACT_NAME),
    startDate: pick(CONTRACT_START),
    endDate: pick(CONTRACT_END),
    jia: pick(CONTRACT_JIA),
    yi: CONTRACT_YI,
    status: pick(["1", "2", "3"]),
    person: pick(PERSON),
    tel: mobile(),
    // 便于演示 contractNo 精确查询
    ...(i === 0 ? { contractNo: "100001" } : {}),
  }));

  await prisma.contract.createMany({ data });
  console.log(`  ✓ 合同 ${data.length} 条`);
}

async function seedBills() {
  const data = Array.from({ length: 54 }, () => ({
    accountNo: digits(6),
    status: pick(["1", "2"]),
    roomNo: pick(BILL_ROOM),
    carNo: pick(BILL_CAR),
    tel: mobile(),
    costName1: pick(BILL_COST1),
    costName2: "200元/月",
    costName3: pick(BILL_COST3),
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    preferential: 0,
    money: 26000,
    pay: pick(BILL_PAY),
  }));

  await prisma.bill.createMany({ data });
  console.log(`  ✓ 账单 ${data.length} 条`);
}

async function seedEnergy() {
  for (let i = 0; i < ENERGY.length; i++) {
    await prisma.energyRecord.create({
      data: { name: ENERGY[i].name, sort: i, series: ENERGY[i].series },
    });
  }
  console.log(`  ✓ 能源曲线 ${ENERGY.length} 条`);
}

async function seedEquipments() {
  const data = Array.from({ length: 24 }, () => {
    const status = pick(["1", "2", "3"]);
    return {
      no: `EQ${digits(6)}`,
      name: pick(EQUIPMENT_NAMES),
      person: pick(PERSON),
      tel: mobile(),
      time: `${int(8, 20)}年`,
      rest: `${int(1, 7)}年`,
      status,
      last: `202${int(3, 5)}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
      type: pick(EQUIPMENT_TYPES),
      from: pick(EQUIPMENT_FROM),
    };
  });

  await prisma.equipment.createMany({ data });
  console.log(`  ✓ 设备 ${data.length} 条`);
}

async function seedChatMessages() {
  const messages = [
    { fromUser: "admin", toUser: "manager", content: "今天园区能耗报表帮我看一下。", time: "09:12" },
    { fromUser: "manager", toUser: "admin", content: "收到，我整理完会同步给你。", time: "09:14" },
    { fromUser: "manager", toUser: "user", content: "合同列表里有几条待审批，下午需要处理。", time: "10:05" },
    { fromUser: "user", toUser: "admin", content: "我这边新增租户资料已经提交。", time: "11:20" },
  ];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    await prisma.chatMessage.create({
      data: { id: `seed-${i + 1}`, fromUser: m.fromUser, toUser: m.toUser, content: m.content, time: m.time },
    });
  }
  console.log(`  ✓ 私聊消息 ${messages.length} 条`);
}

async function main() {
  console.log("开始写入种子数据...");
  await clearAll();
  console.log("  ✓ 已清空历史数据");
  await seedAccounts();
  await seedMenus();
  await seedTenants();
  await seedRooms();
  await seedContracts();
  await seedBills();
  await seedEnergy();
  await seedEquipments();
  await seedChatMessages();
  console.log("\n种子数据写入完成。可用账号：");
  for (const a of accounts) {
    console.log(`  ${a.accountName.padEnd(10)} / ${a.password.padEnd(15)} (${a.role})`);
  }
}

main()
  .catch((e) => {
    console.error("种子数据写入失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
