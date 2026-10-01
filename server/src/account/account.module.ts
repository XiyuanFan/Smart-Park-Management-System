import { Module } from '@nestjs/common';
import { MenuModule } from '../menu/menu.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [MenuModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
