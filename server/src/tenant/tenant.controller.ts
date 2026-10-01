import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import {
  BatchDeleteTenantDto,
  DeleteTenantDto,
  SaveTenantDto,
  TenantListQueryDto,
} from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('租户管理')
@ApiBearerAuth()
@Controller()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('userList')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({ summary: '企业（租户）分页列表', description: '支持企业名称、联系人、电话模糊筛选' })
  list(@Body() query: TenantListQueryDto) {
    return this.tenantService.list(query);
  }

  @Post('deleteUser')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({ summary: '删除单个企业' })
  remove(@Body() dto: DeleteTenantDto) {
    return this.tenantService.remove(dto);
  }

  @Post('batchDeleteUser')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({ summary: '批量删除企业' })
  batchRemove(@Body() dto: BatchDeleteTenantDto) {
    return this.tenantService.batchRemove(dto);
  }

  @Post('editUser')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('成功')
  @ApiOperation({
    summary: '新增 / 编辑企业',
    description: 'body 中带 id 表示编辑，不带 id 表示新增',
  })
  save(@Body() dto: SaveTenantDto) {
    return this.tenantService.save(dto);
  }
}
