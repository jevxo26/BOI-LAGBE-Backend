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
import { AreasService } from './areas.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ListAreaQueryDto } from './dto/list-area-query.dto';

// All area routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before the parameterized :id route.
@Controller('admin/areas')
@AdminOnly()
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  // ---------- GEO HIERARCHY (reference data) ----------

  @Get('countries')
  async findCountries() {
    return this.areasService.findCountries();
  }

  @Get('divisions')
  async findDivisions(@Query('countryId') countryId?: string) {
    return this.areasService.findDivisions(countryId);
  }

  @Get('districts')
  async findDistricts(@Query('divisionId') divisionId?: string) {
    return this.areasService.findDistricts(divisionId);
  }

  @Get('upazilas')
  async findUpazilas(@Query('districtId') districtId?: string) {
    return this.areasService.findUpazilas(districtId);
  }

  // ---------- INSTITUTES ----------

  @Get('institutes')
  async findAllInstitutes(@Query() query: ListAreaQueryDto) {
    return this.areasService.findAllInstitutes(query);
  }

  @Get('institutes/:id')
  async findInstituteById(@Param('id') id: string) {
    return this.areasService.findInstituteById(id);
  }

  // ---------- AREAS ----------

  @Get()
  async findAllAreas(@Query() query: ListAreaQueryDto) {
    return this.areasService.findAllAreas(query);
  }

  @Get(':id')
  async findAreaById(@Param('id') id: string) {
    return this.areasService.findAreaById(id);
  }

  @Post()
  async createArea(@Body() dto: CreateAreaDto, @Req() req: AdminRequest) {
    return this.areasService.createArea(dto, req);
  }

  @Patch(':id')
  async updateArea(
    @Param('id') id: string,
    @Body() dto: UpdateAreaDto,
    @Req() req: AdminRequest,
  ) {
    return this.areasService.updateArea(id, dto, req);
  }
}
