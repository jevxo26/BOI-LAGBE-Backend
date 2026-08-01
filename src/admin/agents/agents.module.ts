import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities';
import { Area, Institute } from '../areas/entities';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import {
  Agent,
  AgentArea,
  AgentInstitute,
  AgentStore,
  AgentEmployee,
  AgentPerformance,
  AgentSalary,
  AgentCommission,
  AgentSettlement,
  AgentWallet,
  AgentWalletTransaction,
  AgentDocument,
  AgentLeave,
  AgentAttendance,
  AgentTarget,
  AgentBonus,
  AgentPenalty,
  AgentAnnouncement,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agent,
      AgentArea,
      AgentInstitute,
      AgentStore,
      AgentEmployee,
      AgentPerformance,
      AgentSalary,
      AgentCommission,
      AgentSettlement,
      AgentWallet,
      AgentWalletTransaction,
      AgentDocument,
      AgentLeave,
      AgentAttendance,
      AgentTarget,
      AgentBonus,
      AgentPenalty,
      AgentAnnouncement,
      User,
      Area,
      Institute,
    ]),
  ],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
