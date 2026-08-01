import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuditLog, ActivityLog } from '../../rbac/entities';
import { AdminRequest } from '../interfaces/admin-request.interface';

// Shared audit + activity logging for every admin mutation. Writes both an
// audit log (before/after values) and an activity log (human readable
// description) atomically in a single transaction.
@Injectable()
export class AdminAuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    private readonly dataSource: DataSource,
  ) {}

  async log(
    req: AdminRequest,
    module: string,
    action: string,
    referenceType: string,
    referenceId: string,
    description: string,
    oldValue?: unknown,
    newValue?: unknown,
  ) {
    const ipAddress =
      req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const device = req.headers['user-agent'] || 'Unknown';

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        queryRunner.manager.create(AuditLog, {
          userId: req.user.id,
          module,
          action,
          referenceType,
          referenceId,
          oldValue:
            oldValue !== undefined ? this.toPlainObject(oldValue) : undefined,
          newValue:
            newValue !== undefined ? this.toPlainObject(newValue) : undefined,
          ipAddress,
          device,
        }),
      );

      await queryRunner.manager.save(
        queryRunner.manager.create(ActivityLog, {
          userId: req.user.id,
          module,
          activity: action,
          description,
          ipAddress,
          device,
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private toPlainObject(value: unknown): Record<string, unknown> {
    if (value === null || typeof value !== 'object') return { value };
    return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
  }
}
