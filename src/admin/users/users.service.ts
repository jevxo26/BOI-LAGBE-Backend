import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { User } from '../../auth/entities';
import { QueryBuilder } from '../common/utils/query-builder';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  async findAllUsers(query: ListUserQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.role) where.roles = ArrayContains([query.role]);

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['fullName', 'email', 'phone', 'userCode'],
      sortableFields: ['createdAt', 'fullName', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });

    const [users, total] = await this.userRepository.findAndCount(options);
    const items = users.map((user) => this.sanitizeUser(user));
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
        studentProfile: true,
        addresses: true,
        security: true,
        preference: true,
        notificationSetting: true,
        identityVerification: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateUserStatus(
    id: string,
    dto: UpdateUserStatusDto,
    req: AdminRequest,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldValue = this.sanitizeUser(user);
    user.status = dto.status;
    const saved = await this.userRepository.save(user);

    await this.adminAuditService.log(
      req,
      'USERS',
      'UPDATE',
      'User',
      id,
      `Updated user status to ${saved.status}`,
      oldValue,
      this.sanitizeUser(saved),
    );

    return {
      message: 'User status updated successfully',
      user: this.sanitizeUser(saved),
    };
  }

  // Never expose the password hash in admin views or audit logs
  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...rest } = user;
    void password;
    return rest;
  }
}
