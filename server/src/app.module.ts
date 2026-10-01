import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
    /*
     * 内存缓存。
     * cache-manager v7 不传 stores 时会使用 Keyv 的默认内存 store；
     * ttl 单位为毫秒，这里只作为兜底默认值，各业务会按需覆盖。
     * （注意 v7 已移除旧的 max 选项）
     */
    CacheModule.register({ isGlobal: true, ttl: 5 * 60 * 1000 }),
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
