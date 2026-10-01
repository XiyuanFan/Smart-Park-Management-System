import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnergyService } from './energy.service';

@ApiTags('能源消耗')
@ApiBearerAuth()
@Controller()
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('energyData')
  @ApiOperation({ summary: '能源消耗曲线', description: '返回 5 条能源曲线（煤/气/油/电/热），每条 7 个数据点' })
  getEnergyData() {
    return this.energyService.getEnergyData();
  }
}
