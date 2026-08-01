import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ListWarehouseQueryDto } from './dto/list-warehouse-query.dto';

// All warehouse routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before the parameterized :id route.
@Controller('admin/warehouses')
@AdminOnly()
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  // ---------- REFERENCE DATA (zones / shelves / suppliers) ----------

  @Get('zones')
  async findZones(@Query('warehouseId') warehouseId?: string) {
    return this.warehousesService.findZones(warehouseId);
  }

  @Get('shelves')
  async findShelves(
    @Query('warehouseId') warehouseId?: string,
    @Query('zoneId') zoneId?: string,
  ) {
    return this.warehousesService.findShelves(warehouseId, zoneId);
  }

  @Get('suppliers')
  async findSuppliers() {
    return this.warehousesService.findSuppliers();
  }

  // ---------- WAREHOUSES ----------

  @Get()
  async findAll(@Query() query: ListWarehouseQueryDto) {
    return this.warehousesService.findAllWarehouses(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findWarehouseById(id);
  }

  @Post()
  async create(@Body() dto: CreateWarehouseDto, @Req() req: AdminRequest) {
    return this.warehousesService.createWarehouse(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseDto,
    @Req() req: AdminRequest,
  ) {
    return this.warehousesService.updateWarehouse(id, dto, req);
  }
}
