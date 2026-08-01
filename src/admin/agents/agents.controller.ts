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
import { AgentsService } from './agents.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { ListAgentQueryDto } from './dto/list-agent-query.dto';
import { AssignAgentAreasDto } from './dto/assign-agent-areas.dto';
import { AssignAgentInstitutesDto } from './dto/assign-agent-institutes.dto';

// All agent routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@Controller('admin/agents')
@AdminOnly()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async findAll(@Query() query: ListAgentQueryDto) {
    return this.agentsService.findAllAgents(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentsService.findAgentById(id);
  }

  @Post()
  async create(@Body() dto: CreateAgentDto, @Req() req: AdminRequest) {
    return this.agentsService.createAgent(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.updateAgent(id, dto, req);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAgentStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.updateAgentStatus(id, dto, req);
  }

  @Post(':id/areas')
  async assignAreas(
    @Param('id') id: string,
    @Body() dto: AssignAgentAreasDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.assignAgentAreas(id, dto, req);
  }

  @Post(':id/institutes')
  async assignInstitutes(
    @Param('id') id: string,
    @Body() dto: AssignAgentInstitutesDto,
    @Req() req: AdminRequest,
  ) {
    return this.agentsService.assignAgentInstitutes(id, dto, req);
  }
}
