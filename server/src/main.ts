// 必须放在最前面：PrismaClient 在构造时就要读取 process.env.DATABASE_URL
import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: allowedOrigins, credentials: true });

  // ---------------- Swagger 接口文档 ----------------
  const swaggerConfig = new DocumentBuilder()
    .setTitle('朋远智慧园区管理平台 API')
    .setDescription(
      '智慧园区中后台的 REST 接口文档。\n\n' +
        '**鉴权方式**：除 `POST /login` 与 `GET /health` 外，所有接口都需要在请求头携带\n' +
        '`Authorization: Bearer <token>`。\n\n' +
        '**响应约定**：成功返回 HTTP 200，响应体为 `{ code, message, data }`；\n' +
        '失败返回真实的 HTTP 4xx/5xx 状态码，响应体为 `{ code, message, data: null }`。'
    )
    .setVersion('2.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: '登录接口返回的 token，填入时不需要再加 Bearer 前缀',
    })
    .addTag('认证与权限')
    .addTag('租户管理')
    .addTag('设备管理')
    .addTag('物业管理')
    .addTag('财务管理')
    .addTag('能源消耗')
    .addTag('账号管理')
    .addTag('内部私聊')
    .addTag('系统')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`服务已启动:      http://localhost:${port}`);
  logger.log(`Swagger 文档:    http://localhost:${port}/api-docs`);
  logger.log(`健康检查:        http://localhost:${port}/health`);
  logger.log(`允许的前端来源:  ${allowedOrigins.join(', ')}`);
}

void bootstrap();
