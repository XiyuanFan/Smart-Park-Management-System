import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { MenuModule } from './menu/menu.module';
import { HealthModule } from './health/health.module';
import { TenantModule } from './tenant/tenant.module';
import { EquipmentModule } from './equipment/equipment.module';
import { EstateModule } from './estate/estate.module';
import { FinanceModule } from './finance/finance.module';
import { EnergyModule } from './energy/energy.module';
import { AccountModule } from './account/account.module';
import { ChatModule } from './chat/chat.module';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    // isGlobal 让 ConfigService 在各模块中无需重复 import
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MenuModule,
    AuthModule,
    HealthModule,
    TenantModule,
    EquipmentModule,
    EstateModule,
    FinanceModule,
    EnergyModule,
    AccountModule,
    ChatModule,
  ],
  providers: [
    // 用 APP_* 令牌注册全局组件，这样它们可以正常参与依赖注入
    // （若用 app.useGlobalGuards() 手动注册，则拿不到 Reflector / JwtService）
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
