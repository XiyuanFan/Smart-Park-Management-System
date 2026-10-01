import { Router } from "express";
import { requireAuth } from "../middleware/auth";

import authRouter from "./auth";
import tenantRouter from "./tenant";
import equipmentRouter from "./equipment";
import estateRouter from "./estate";
import financeRouter from "./finance";
import energyRouter from "./energy";
import accountRouter from "./account";
import chatRouter from "./chat";

const router = Router();

// 登录接口必须公开；auth 路由里的 /menu 自己带了 requireAuth
router.use(authRouter);

// 以下所有业务接口统一要求携带有效 token
router.use(requireAuth);
router.use(tenantRouter);
router.use(equipmentRouter);
router.use(estateRouter);
router.use(financeRouter);
router.use(energyRouter);
router.use(accountRouter);
router.use(chatRouter);

export default router;
