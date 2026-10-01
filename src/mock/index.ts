import Mock from "mockjs"
Mock.setup({
    timeout: "200-600"
})

const mockAccounts = [
    { id: "admin", accountName: "admin", password: "admin123123", auth: "admin", person: "赵铁柱", tel: "188888888888", department: "总裁办", token: "mocktoken123456admin", btnAuth: ["add", "edit", "delete"] },
    { id: "manager", accountName: "manager", password: "manager123123", auth: "manager", person: "刘伟", tel: "16666666666", department: "财务部", token: "mocktoken123456manager", btnAuth: ["add", "edit"] },
    { id: "user", accountName: "user", password: "user123123", auth: "user", person: "王丽丽", tel: "17777777777", department: "网推部", token: "mocktoken123456user", btnAuth: ["add"] },
    { id: "xuchao", accountName: "xuchao", password: "xuchao123", auth: "admin", person: "徐超", tel: "188888888888", department: "总裁办", token: "mocktoken123456xuchao", btnAuth: ["add", "edit", "delete"] },
    { id: "user01", accountName: "user01", password: "user01123", auth: "user", person: "王丽丽", tel: "17777777777", department: "网推部", token: "mocktoken123456user01", btnAuth: ["add"] },
    { id: "manager01", accountName: "manager01", password: "manager01123", auth: "manager", person: "刘伟", tel: "16666666666", department: "财务部", token: "mocktoken123456manager01", btnAuth: ["add", "edit"] },
    { id: "user02", accountName: "user02", password: "user02123", auth: "customize", person: "张安定", tel: "15555555555", department: "企划部", token: "mocktoken123456user02", btnAuth: ["add"] },
    { id: "laowang", accountName: "laowang", password: "laowang123", auth: "user", person: "王大大", tel: "14444444444", department: "总裁办", token: "mocktoken123456laowang", btnAuth: ["add"] },
]
//后端接口未完成时，前端可以先通过 Mock.js 模拟不同用户和权限场景，提前完成登录、菜单、动态路由和页面

//登录接口
Mock.mock("https://www.demo.com/login", "post", (options: any) => {
    //console.log("options",options.body)
    const { username, password } = JSON.parse(options.body)
    const account = mockAccounts.find(item => item.accountName === username && item.password === password);
    if (account) {
        return {
            code: 200,
            message: "登录成功",
            data: {
                username: account.person,
                accountName: account.accountName,
                token: account.token,
                btnAuth: account.btnAuth
            }
        }
    }
    if (username === "admin" && password === "admin123123") {
        return {
            code: 200,
            message: "登录成功",
            data: {
                username: "赵铁柱",
                token: "mocktoken123456admin",
                btnAuth:["add","edit","delete"] //按钮权限
            }
        }
    } else if (username === "manager" && password === "manager123123") {
        return {
            code: 200,
            message: "登录成功",
            data: {
                username: "manager",
                token: "mocktoken123456manager",
                btnAuth:["add","edit"]
            }
        }
    } else if (username == "user" && password === "user123123") {
        return {
            code: 200,
            message: "登录成功",
            data: {
                username: "user",
                token: "mocktoken123456user",
                btnAuth:["add"]
            }
        }
    } else {
        return {
            code: 401,
            message: "用户名或密码有误",
            data: ""
        }
    }


})

// 菜单
const menuList = [
    {
        "icon": "DashboardOutlined",
        "label": "工作台",
        "key": "/dashboard",
    },
    {

        "icon": "TeamOutlined",
        "label": "租户管理",
        "key": "/users",
        "children": [
            {
                "icon": "UnorderedListOutlined",
                "label": "租户列表",
                "key": "/users/list",
            },
            {
                "icon": "UserAddOutlined",
                "label": "新增租户",
                "key": "/users/add",
            }
        ]
    },
    {
        "icon": "LaptopOutlined",
        "label": "物业管理",
        "key": "/estate",
        "children": [
            {

                "icon": "InsertRowLeftOutlined",
                "label": "楼宇管理",
                "key": "/estate/tenement",

            },
            {
                "icon": "BankOutlined",
                "label": "房间管理",
                "key": "/estate/room",
            },
            {
                "icon": "TruckOutlined",
                "label": "车辆信息",
                "key": "/estate/car",
            }
        ]
    },
    {
        "icon": "ToolOutlined",
        "label": "报修管理",
        "key": "/repair"
    },
    {
        "icon": "DollarOutlined",
        "label": "财务管理",
        "key": "/finance",
        "children": [
            {

                "icon": "ProfileOutlined",
                "label": "合同管理",
                "key": "/finance/contract",

            },
            {
                "icon": "FrownOutlined",
                "label": "合同详情",
                "key": "/finance/surrender",
            },
            {
                "icon": "FileTextOutlined",
                "label": "账单管理",
                "key": "/finance/bill",
            }
        ]
    },
    {
        "icon": "TransactionOutlined",
        "label": "招商管理",
        "key": "/merchants",
    },
    {
        "icon": "FundProjectionScreenOutlined",
        "label": "运营管理",
        "key": "/operation",
        "children": [
            {

                "icon": "FundViewOutlined",
                "label": "运营总览",
                "key": "/operation/all",

            },
            {
                "icon": "ReadOutlined",
                "label": "文章发布",
                "key": "/operation/article",
            },
            {
                "icon": "CommentOutlined",
                "label": "内容评论",
                "key": "/operation/comments",
            }
        ]
    },
    {
        "icon": "ToolOutlined",
        "label": "设备管理",
        "key": "/equipment",
    },
    {
        "icon": "ThunderboltOutlined",
        "label": "能源消耗",
        "key": "/energy",
    },
    {
        "icon": "SettingOutlined",
        "label": "系统设置",
        "key": "/settings",
    },
    {
        "icon": "UserOutlined",
        "label": "个人中心",
        "key": "/personal",
    }
]

const userMenuList = [
    {
        "icon": "DashboardOutlined",
        "label": "工作台",
        "key": "/dashboard",
    },
    {

        "icon": "TeamOutlined",
        "label": "租户管理",
        "key": "/users",
        "children": [
            {
                "icon": "UnorderedListOutlined",
                "label": "租户列表",
                "key": "/users/list",
            },
            {
                "icon": "UserAddOutlined",
                "label": "新增租户",
                "key": "/users/add",
            }
        ]
    },
    {
        "icon": "LaptopOutlined",
        "label": "物业管理",
        "key": "/estate",
        "children": [
            {

                "icon": "InsertRowLeftOutlined",
                "label": "楼宇管理",
                "key": "/estate/tenement",

            },
            {
                "icon": "BankOutlined",
                "label": "房间管理",
                "key": "/estate/room",
            },
            {
                "icon": "TruckOutlined",
                "label": "车辆信息",
                "key": "/estate/car",
            }
        ]
    },
    {
        "icon": "ToolOutlined",
        "label": "报修管理",
        "key": "/repair"
    },
    {
        "icon": "ToolOutlined",
        "label": "设备管理",
        "key": "/equipment",
    },
    {
        "icon": "ThunderboltOutlined",
        "label": "能源消耗",
        "key": "/energy",
    },
    {
        "icon": "UserOutlined",
        "label": "个人中心",
        "key": "/personal",
    }
]

const managerMenuList = [
    {
        "icon": "DashboardOutlined",
        "label": "工作台",
        "key": "/dashboard",
    },
    {

        "icon": "TeamOutlined",
        "label": "租户管理",
        "key": "/users",
        "children": [
            {
                "icon": "UnorderedListOutlined",
                "label": "租户列表",
                "key": "/users/list",
            },
            {
                "icon": "UserAddOutlined",
                "label": "新增租户",
                "key": "/users/add",
            }
        ]
    },
    {
        "icon": "LaptopOutlined",
        "label": "物业管理",
        "key": "/estate",
        "children": [
            {

                "icon": "InsertRowLeftOutlined",
                "label": "楼宇管理",
                "key": "/estate/tenement",

            },
            {
                "icon": "BankOutlined",
                "label": "房间管理",
                "key": "/estate/room",
            },
            {
                "icon": "TruckOutlined",
                "label": "车辆信息",
                "key": "/estate/car",
            }
        ]
    },
    {
        "icon": "ToolOutlined",
        "label": "报修管理",
        "key": "/repair"
    },
    {
        "icon": "TransactionOutlined",
        "label": "招商管理",
        "key": "/merchants",
    },
    {
        "icon": "FundProjectionScreenOutlined",
        "label": "运营管理",
        "key": "/operation",
        "children": [
            {

                "icon": "FundViewOutlined",
                "label": "运营总览",
                "key": "/operation/all",

            },
            {
                "icon": "ReadOutlined",
                "label": "文章发布",
                "key": "/operation/article",
            },
            {
                "icon": "CommentOutlined",
                "label": "内容评论",
                "key": "/operation/comments",
            }
        ]
    },
    {
        "icon": "ToolOutlined",
        "label": "设备管理",
        "key": "/equipment",
    },
    {
        "icon": "ThunderboltOutlined",
        "label": "能源消耗",
        "key": "/energy",
    },
    {
        "icon": "SettingOutlined",
        "label": "系统设置",
        "key": "/settings",
    },
    {
        "icon": "UserOutlined",
        "label": "个人中心",
        "key": "/personal",
    }
]

const customizeMenuList = [
    {
      "icon": "DashboardOutlined",
      "label": "工作台",
      "key": "/dashboard",
    },
    {
  
      "icon": "TeamOutlined",
      "label": "租户管理",
      "key": "/users",
      "children": [
        {
          "icon": "UnorderedListOutlined",
          "label": "租户列表",
          "key": "/users/list",
        },
      ]
    },
    {
      "icon": "LaptopOutlined",
      "label": "物业管理",
      "key": "/estate",
      "children": [
        {
          "icon": "InsertRowLeftOutlined",
          "label": "楼宇管理",
          "key": "/estate/tenement",
        },
       
      ]
    },
    {
      "icon": "ToolOutlined",
      "label": "报修管理",
      "key": "/repair"
    },
    {
      "icon": "ToolOutlined",
      "label": "设备管理",
      "key": "/equipment",
    },
    {
      "icon": "ThunderboltOutlined",
      "label": "能源消耗",
      "key": "/energy",
    },
    {
      "icon": "UserOutlined",
      "label": "个人中心",
      "key": "/personal",
    }
  ]
  

//菜单接口
const chatMenu = {
    "icon": "MessageOutlined",
    "label": "内部私聊",
    "key": "/chat",
}

function withChatMenu(menu: any[]) {
    if (menu.some(item => item.key === "/chat")) {
        return menu;
    }

    const lastItem = menu[menu.length - 1];
    return [...menu.slice(0, -1), chatMenu, lastItem];
}

Mock.mock('https://www.demo.com/menu', "get", (options: any) => {
    const token = sessionStorage.getItem("token");
    const account = mockAccounts.find(item => item.token === token);
    if (account?.auth === "admin") {
        return {
            code: 200,
            message: '请求成功',
            data: withChatMenu(menuList)
        }
    } else if (account?.auth === "user") {
        return {
            code: 200,
            message: '请求成功',
            data: withChatMenu(userMenuList)
        }
    } else if (account?.auth === "manager") {
        return {
            code: 200,
            message: '请求成功',
            data: withChatMenu(managerMenuList)
        }
    } else if (account?.auth === "customize") {
        return {
            code: 200,
            message: '璇锋眰鎴愬姛',
            data: withChatMenu(customizeMenuList)
        }
    } else {
        return {
            code: 200,
            message: "失败",
            data: []
        }
    }
})

//dashboard里 图表接口
const staffList = [
    { id: "admin", name: "赵铁柱", accountName: "admin", department: "总裁办", role: "超级管理员", online: true },
    { id: "manager", name: "刘伟", accountName: "manager", department: "财务部", role: "园区经理", online: true },
    { id: "user", name: "王丽丽", accountName: "user", department: "网推部", role: "普通员工", online: false },
    { id: "user02", name: "张安定", accountName: "user02", department: "企划部", role: "运营专员", online: true },
    { id: "laowang", name: "王大大", accountName: "laowang", department: "总裁办", role: "行政人员", online: false },
]

const chatMessages: Record<string, any[]> = {
    admin: [
        { id: "admin-1", from: "admin", to: "me", content: "今天园区能耗报表帮我看一下。", time: "09:12" },
        { id: "admin-2", from: "me", to: "admin", content: "收到，我整理完会同步给你。", time: "09:14" },
    ],
    manager: [
        { id: "manager-1", from: "manager", to: "me", content: "合同列表里有几条待审批，下午需要处理。", time: "10:05" },
    ],
    user: [
        { id: "user-1", from: "user", to: "me", content: "我这边新增租户资料已经提交。", time: "11:20" },
    ],
}

Mock.mock('https://www.demo.com/chat/staff', "get", () => {
    const username = sessionStorage.getItem("username");
    return {
        code: 200,
        message: "请求成功",
        data: staffList.filter(item => item.name !== username && item.accountName !== username)
    }
})

Mock.mock(/https:\/\/www\.demo\.com\/chat\/messages.*/, "get", (options: any) => {
    const url = new URL(options.url);
    const friendId = url.searchParams.get("friendId") || "";
    return {
        code: 200,
        message: "请求成功",
        data: chatMessages[friendId] || []
    }
})

Mock.mock('https://www.demo.com/chat/send', "post", (options: any) => {
    const { to, content } = JSON.parse(options.body);
    const message = {
        id: `${to}-${Date.now()}`,
        from: "me",
        to,
        content,
        time: new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
    };

    chatMessages[to] = [...(chatMessages[to] || []), message];

    return {
        code: 200,
        message: "发送成功",
        data: message
    }
})

const roleNameMap: Record<string, string> = {
    admin: "管理员",
    manager: "经理",
    user: "普通员工",
    customize: "自定义用户",
}

const chatV2Messages: Record<string, any[]> = {}

function getChatV2ConversationKey(userA: string, userB: string) {
    return [userA, userB].sort().join("__");
}

Mock.mock('https://www.demo.com/chat/v2/staff', "get", () => {
    const accountName = sessionStorage.getItem("accountName");
    return {
        code: 200,
        message: "请求成功",
        data: mockAccounts
            .filter(item => item.accountName !== accountName)
            .map(item => ({
                id: item.accountName,
                name: item.person,
                accountName: item.accountName,
                department: item.department,
                role: roleNameMap[item.auth] || item.auth,
                online: true,
            }))
    }
})

Mock.mock(/https:\/\/www\.demo\.com\/chat\/v2\/messages.*/, "get", (options: any) => {
    const url = new URL(options.url);
    const friendId = url.searchParams.get("friendId") || "";
    const accountName = sessionStorage.getItem("accountName") || "";
    const conversationKey = getChatV2ConversationKey(accountName, friendId);
    return {
        code: 200,
        message: "请求成功",
        data: chatV2Messages[conversationKey] || []
    }
})

Mock.mock('https://www.demo.com/chat/v2/send', "post", (options: any) => {
    const { to, content } = JSON.parse(options.body);
    const from = sessionStorage.getItem("accountName") || "unknown";
    const message = {
        id: `${from}-${to}-${Date.now()}`,
        from,
        to,
        content,
        time: new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
    };

    const conversationKey = getChatV2ConversationKey(from, to);
    chatV2Messages[conversationKey] = [...(chatV2Messages[conversationKey] || []), message];

    return {
        code: 200,
        message: "发送成功",
        data: message
    }
})

Mock.mock('https://www.demo.com/chat/v2/save', "post", (options: any) => {
    const message = JSON.parse(options.body);
    const conversationKey = getChatV2ConversationKey(message.from, message.to);
    const exists = (chatV2Messages[conversationKey] || []).some(item => item.id === message.id);

    if (!exists) {
        chatV2Messages[conversationKey] = [...(chatV2Messages[conversationKey] || []), message];
    }

    return {
        code: 200,
        message: "保存成功",
        data: message
    }
})

Mock.mock('https://www.demo.com/energyData',"get",()=>{
    return {
        code:200,
        message:"请求成功",
        data:[
            {name:"煤",data:[120, 132, 101, 134, 90, 230, 210]},
            {name:"气",data:[220, 182, 191, 234, 290, 330, 310]},
            {name:"油",data: [150, 232, 201, 154, 190, 330, 410]},
            {name:"电",data:[320, 332, 301, 334, 390, 330, 320]},
            {name:"热",data:[820, 932, 901, 934, 1290, 1330, 1320]}
        ]
    }
})

Mock.Random.extend({
    phone: function () {
      var phonePrefixs = ['13','14','15','16','17','18','19'] // 自己写前缀哈
      return this.pick(phonePrefixs) + Mock.mock(/\d{9}/) //Number()
    }
  })

//租户列表的接口
Mock.mock("https://www.demo.com/userList","post",(options:any)=>{
    const {pageSize,page,companyName,contact,phone}=JSON.parse(options.body)
    console.log("租户列表接收到参数",page,pageSize,companyName,contact,phone)
    return {
        code:200,
        message:"成功",
        data:Mock.mock({
            [`list|${pageSize}`]:[
                {
                    "id":"@string('number',6)",//随机生成一个六位数字id
                    "name":"@cname",//随机生成一个人名
                    "status|1":["1","2","3"],
                    "tel":'@phone',
                    "business|1": ['制造业','互联网','新媒体','美业','新能源','物流','电商'],
                    "email":"@email",
                    "creditCode":"@string('number',18)",
                    "industryNum":"@string('number',15)",
                    "organizationCode":"@string('upper',9)",
                    "legalPerson":"@cname",
                },
            ],
            total:78
        })
    }
})

//删除企业
Mock.mock('https://www.demo.com/deleteUser','post',(options:any)=>{
  const {id}=JSON.parse(options.body);
  console.log("删除企业",id);
  return {
    code: 200,
    message: "成功",
    data:"操作成功"
  }
})

//批量删除企业
Mock.mock('https://www.demo.com/batchDeleteUser','post',(options:any)=>{
  const {ids}=JSON.parse(options.body);
  console.log("ids",ids)
  return {
    code: 200,
    message: "成功",
    data:"操作成功"
  }
})
//编辑企业
Mock.mock('https://www.demo.com/editUser','post',(options:any)=>{
  console.log("编辑企业收到参数",JSON.parse(options.body))
  return {
    code: 200,
    message: "成功",
    data:"操作成功"
  }
})
//获取房间列表的接口
function generateRooms() {
    const rooms = [];
    for (let i = 0; i < 50; i++) {
        const floor = 1 + Math.floor(i / 6); // 每6个房间一层
        const roomNumber = floor * 100 + (101 + (i % 6)); // 计算房间号
        rooms.push({
            roomNumber,
            decorationType: Mock.Random.pick(['毛坯', '精装']),
            area: Mock.Random.integer(70, 300),
            unitPrice: Mock.Random.integer(1, 3),
            src:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        });
    }
    return rooms;
  }
  Mock.mock('https://www.demo.com/roomList', 'post', (options:any) => {
    console.log("收到房间id",JSON.parse(options.body).roomid)
    return {
        code: 200,
        message: "成功",
        data: {
            rooms: generateRooms()
        }
    };
  });

  //合同管理
  Mock.mock('https://www.demo.com/contractList', 'post', (options: any) => {
  const {page,pageSize}=JSON.parse(options.body);
  console.log("后端合同管理接到参数",JSON.parse(options.body))
  return {
    code: 200,
    message: "成功",
    data: Mock.mock({
      [`list|${pageSize}`]: [{
        'contractNo':'@string("number", 6)',
        'type|1': ['租赁合同','自定义合同','购买合同'],
        'name|1': ["房屋租赁合同通用模版","车位租赁合同通用模版","商业房产买卖合同"],  
        "startDate|1":['2023-01-01','2023-03-05','2023-04-01'],
        "endDate|1":['2024-01-01','2024-03-05','2024-04-01'],
        'jia|1': ['万物科技有限公司','大鱼网络科技','六六信息技术有限公司'],  
        'yi': '天明物业有限公司', 
        'status|1': ["1","2","3"],  
      }],
      "total": 54
    })
    // 生成55条数据
  }
});

//账单管理
Mock.mock('https://www.demo.com/billList', 'post', (options: any) => {
  const {page,pageSize,companyName,contact,phone}=JSON.parse(options.body);
  console.log("后端账单管理接到参数",JSON.parse(options.body))
  return {
    code: 200,
    message: "成功",
    data: Mock.mock({
      [`list|${pageSize}`]: [{
        'accountNo':'@string("number", 6)',
        'status|1': ['1','2'],
        'roomNo|1': ["A1幢写字楼-201","B1幢写字楼-402","B2幢写字楼-701","C2幢写字楼-1601"],  
        "carNo|1":['B109','C227','C106',"D158"],
        "tel|1":['@phone'],
        'costName1|1': [1278.00,2633.00,3698.00],  
        'costName2': '200元/月', 
        'costName3|1': ["25800/年","19800/年"],  
        'startDate':"2023-01-01",
        'endDate':"2024-01-01",
        'preferential':0.00,
        'money':26000.00,
        'pay|1':["微信","支付宝","现金","银行卡转账"]
      }],
      "total": 54
    })
    // 生成55条数据
  }
});
//账号管理
Mock.mock('https://www.demo.com/accountList', 'post', (options: any) => {
//  const {page,pageSize,companyName,contact,phone}=JSON.parse(options.body);
  console.log("后端账号管理接到参数",options)
  return {
    code: 200,
    message: "成功",
    data: {
      list:[
        {
          id:1001,accountName:"xuchao",auth:"admin",person:"徐超",tel:"188888888888",department:"总裁办",menu:menuList
        },
        {
          id:1002,accountName:"user01",auth:"user",person:"王丽丽",tel:"17777777777",department:"网推部",menu:userMenuList
        },
        {
          id:1003,accountName:"manager01",auth:"manager",person:"刘伟",tel:"16666666666",department:"财务部",menu:managerMenuList
        },
        {
          id:1004,accountName:"user02",auth:"customize",person:"张安定",tel:"15555555555",department:"企划部",menu:customizeMenuList
        },
        {
          id:1005,accountName:"laowang",auth:"user",person:"王大大",tel:"14444444444",department:"总裁办",menu:userMenuList
        }

      ],
      total:5
    }
  }
});

