import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions, type JwtSignOptions } from '@nestjs/jwt';
import { MenuModule } from '../menu/menu.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MenuModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // jsonwebtoken 的 expiresIn 类型是 number | StringValue，这里显式收窄
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '2h') as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  // 导出 JwtModule 供 AppModule 里全局注册的 AuthGuard 注入 JwtService
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
