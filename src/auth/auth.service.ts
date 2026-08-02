import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import type { Request } from 'express';
import {
  User,
  UserProfile,
  StudentProfile,
  UserSecurity,
  UserPreference,
  UserNotificationSetting,
  UserActivity,
  UserOTP,
  UserLoginHistory,
  UserDevice,
  UserSession,
  OtpPurpose,
  OtpStatus,
  SessionStatus,
  ActivityType,
} from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserOTP)
    private readonly otpRepository: Repository<UserOTP>,
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
    @InjectRepository(UserLoginHistory)
    private readonly loginHistoryRepository: Repository<UserLoginHistory>,
    @InjectRepository(UserDevice)
    private readonly deviceRepository: Repository<UserDevice>,
    @InjectRepository(UserActivity)
    private readonly activityRepository: Repository<UserActivity>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  private generateUserCode(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `BL-${randomNum}`;
  }

  // 1. REGISTER USER
  async register(dto: RegisterDto) {
    const existingPhone = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });
    if (existingPhone) {
      throw new BadRequestException(
        'User with this phone number already exists',
      );
    }

    if (dto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const fullName = `${dto.firstName} ${dto.lastName}`.trim();
    // Public registration always creates a STUDENT account. Roles (ADMIN,
    // SUPER_ADMIN, etc.) are granted exclusively by admins via
    // POST /admin/rbac/users/:id/roles — never from the registration body.
    const userRoles: string[] = ['STUDENT'];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create User
      const user = queryRunner.manager.create(User, {
        userCode: this.generateUserCode(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: fullName,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        roles: userRoles,
        isActive: true,
        isVerified: false,
      });
      const savedUser = await queryRunner.manager.save(user);

      // Create 1:1 linked entities
      await queryRunner.manager.save(
        queryRunner.manager.create(UserProfile, { userId: savedUser.id }),
      );

      if (userRoles.includes('STUDENT')) {
        await queryRunner.manager.save(
          queryRunner.manager.create(StudentProfile, {
            userId: savedUser.id,
            studentId: dto.studentId,
            instituteId: dto.instituteId,
            campusId: dto.campusId,
            departmentId: dto.departmentId,
            programId: dto.programId,
          }),
        );
      }

      await queryRunner.manager.save(
        queryRunner.manager.create(UserSecurity, { userId: savedUser.id }),
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(UserPreference, { userId: savedUser.id }),
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(UserNotificationSetting, {
          userId: savedUser.id,
        }),
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(UserActivity, {
          userId: savedUser.id,
          activity: ActivityType.REGISTER,
        }),
      );

      await queryRunner.commitTransaction();

      return {
        message: 'User registered successfully',
        user: {
          id: savedUser.id,
          userCode: savedUser.userCode,
          fullName: savedUser.fullName,
          email: savedUser.email,
          phone: savedUser.phone,
          roles: savedUser.roles,
          status: savedUser.status,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 2. SEND OTP
  async sendOtp(dto: SendOtpDto) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    const otpRecord = this.otpRepository.create({
      userId: user?.id,
      phone: dto.phone,
      otp: otpCode,
      purpose: dto.purpose as OtpPurpose,
      expiresAt: expiresAt,
      status: OtpStatus.PENDING,
    });
    await this.otpRepository.save(otpRecord);

    return {
      message: 'OTP sent successfully',
      otpDebug: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    };
  }

  // 3. VERIFY OTP
  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.otpRepository.findOne({
      where: {
        phone: dto.phone,
        purpose: dto.purpose as OtpPurpose,
        status: OtpStatus.PENDING,
      },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('No pending OTP found');
    }

    if (new Date() > otpRecord.expiresAt) {
      otpRecord.status = OtpStatus.EXPIRED;
      await this.otpRepository.save(otpRecord);
      throw new BadRequestException('OTP has expired');
    }

    if (otpRecord.otp !== dto.otp) {
      otpRecord.attemptCount += 1;
      await this.otpRepository.save(otpRecord);
      throw new BadRequestException('Invalid OTP code');
    }

    otpRecord.status = OtpStatus.VERIFIED;
    otpRecord.verifiedAt = new Date();
    await this.otpRepository.save(otpRecord);

    if (otpRecord.userId) {
      await this.userRepository.update(otpRecord.userId, {
        isVerified: true,
        phoneVerifiedAt: new Date(),
      });
    }

    return { message: 'OTP verified successfully' };
  }

  // 4. LOGIN USER & GENERATE COOKIE TOKENS
  async login(dto: LoginDto, req: Request) {
    const user = await this.userRepository.findOne({
      where: [{ email: dto.identity }, { phone: dto.identity }],
      relations: { security: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.security?.accountLocked) {
      throw new UnauthorizedException(
        'Account locked due to multiple failed login attempts',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      if (user.security) {
        user.security.failedLoginAttempt += 1;
        if (user.security.failedLoginAttempt >= 5) {
          user.security.accountLocked = true;
        }
        await this.dataSource.getRepository(UserSecurity).save(user.security);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.security) {
      user.security.failedLoginAttempt = 0;
      await this.dataSource.getRepository(UserSecurity).save(user.security);
    }

    const ipAddress =
      req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await this.loginHistoryRepository.save(
      this.loginHistoryRepository.create({
        userId: user.id,
        ipAddress,
        browser: userAgent,
        status: 'SUCCESS',
      }),
    );

    if (dto.deviceId) {
      await this.deviceRepository.save({
        id: dto.deviceId,
        userId: user.id,
        deviceId: dto.deviceId,
        deviceName: dto.deviceName || 'Device',
        ipAddress,
        lastLoginAt: new Date(),
      });
    }

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const session = this.sessionRepository.create({
      userId: user.id,
      deviceId: dto.deviceId,
      accessToken: '',
      refreshToken: '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: SessionStatus.ACTIVE,
    });
    const savedSession = await this.sessionRepository.save(session);

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.phone,
      user.roles,
      savedSession.id,
    );

    savedSession.accessToken = tokens.accessToken;
    savedSession.refreshToken = tokens.refreshToken;
    await this.sessionRepository.save(savedSession);

    await this.activityRepository.save(
      this.activityRepository.create({
        userId: user.id,
        activity: ActivityType.LOGIN,
        ipAddress,
      }),
    );

    return {
      user: {
        id: user.id,
        userCode: user.userCode,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
      },
      tokens,
      sessionId: savedSession.id,
    };
  }

  // 5. REFRESH TOKEN
  async refreshToken(
    userId: string,
    sessionId: string,
    oldRefreshToken: string,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: { user: true },
    });

    if (
      !session ||
      session.status !== SessionStatus.ACTIVE ||
      session.refreshToken !== oldRefreshToken
    ) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token session',
      );
    }

    const tokens = await this.generateTokens(
      session.user.id,
      session.user.email,
      session.user.phone,
      session.user.roles,
      session.id,
    );

    session.accessToken = tokens.accessToken;
    session.refreshToken = tokens.refreshToken;
    await this.sessionRepository.save(session);

    return tokens;
  }

  // 6. LOGOUT
  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.sessionRepository.update(sessionId, {
        status: SessionStatus.LOGGED_OUT,
        logoutAt: new Date(),
      });
    }

    await this.activityRepository.save(
      this.activityRepository.create({
        userId,
        activity: ActivityType.LOGOUT,
      }),
    );

    return { message: 'Logged out successfully' };
  }

  // 7. GET PROFILE WITH ALL RELATED SUB-OBJECTS
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        profile: true,
        studentProfile: true,
        addresses: true,
        devices: true,
        security: true,
        preference: true,
        notificationSetting: true,
        identityVerification: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async generateTokens(
    userId: string,
    email: string | undefined,
    phone: string,
    roles: string[],
    sessionId: string,
  ) {
    const payload = { sub: userId, email, phone, roles, sessionId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'supersecret_jwt_access_key',
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'supersecret_jwt_refresh_key',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
