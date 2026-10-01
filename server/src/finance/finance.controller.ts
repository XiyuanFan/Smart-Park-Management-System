import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { BillListQueryDto, ContractListQueryDto } from './dto/finance.dto';
import { FinanceService } from './finance.service';

@ApiTags('财务管理')
@ApiBearerAuth()
@Controller()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('contractList')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({ summary: '合同分页列表', description: '支持合同号、联系人、电话筛选' })
  listContracts(@Body() query: ContractListQueryDto) {
    return this.financeService.listContracts(query);
  }

  @Post('billList')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({ summary: '账单分页列表', description: '支持编号、状态、日期区间筛选' })
  listBills(@Body() query: BillListQueryDto) {
    return this.financeService.listBills(query);
  }
}
