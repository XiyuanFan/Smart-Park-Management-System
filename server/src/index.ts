import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import routes from "./routes";
import { bizFail, serverError } from "./lib/response";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// 允许的前端来源，支持逗号分隔配置多个
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// 健康检查，便于确认服务是否启动成功
app.get("/health", (_req, res) => {
  res.json({
    code: 200,
    message: "ok",
    data: { uptime: process.uptime(), timestamp: Date.now() },
  });
});

app.use(routes);

// 未匹配到任何路由
app.use((_req: Request, res: Response) => {
  res.status(200).json({ code: 404, message: "接口不存在", data: null });
});

// 全局错误兜底：必须放在所有路由之后，且保留 4 个形参
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // body-parser 解析失败这类客户端错误自带 4xx 状态码，
  // 直接透传，避免把「请求体格式错」误报成 500。
  const status = (err as { statusCode?: number; status?: number })?.statusCode
    ?? (err as { status?: number })?.status;

  if (typeof status === "number" && status >= 400 && status < 500) {
    return bizFail(res, status, "请求体格式有误");
  }

  console.error("[server error]", err);
  return serverError(res);
});

const server = app.listen(PORT, () => {
  console.log(`[smart-park-server] 已启动: http://localhost:${PORT}`);
  console.log(`[smart-park-server] 允许的前端来源: ${allowedOrigins.join(", ")}`);
  console.log(`[smart-park-server] 健康检查: http://localhost:${PORT}/health`);
});

// 优雅退出，避免开发时端口残留
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.log(`\n[smart-park-server] 收到 ${signal}，正在关闭...`);
    server.close(() => process.exit(0));
  });
}
