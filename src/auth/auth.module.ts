import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { StrictJwtAuthGuard } from './guards/strict-jwt-auth.guard';
import {
  User,
  UserProfile,
  StudentProfile,
  UserAddress,
  UserDevice,
  UserSession,
  UserOTP,
  UserToken,
  UserLoginHistory,
  UserSecurity,
  UserPreference,
  UserNotificationSetting,
  UserIdentityVerification,
  UserAttachment,
  UserActivity,
  SupportTicket,
} from './entities';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      StudentProfile,
      UserAddress,
      UserDevice,
      UserSession,
      UserOTP,
      UserToken,
      UserLoginHistory,
      UserSecurity,
      UserPreference,
      UserNotificationSetting,
      UserIdentityVerification,
      UserAttachment,
      UserActivity,
      SupportTicket,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, StrictJwtAuthGuard],
  exports: [AuthService, StrictJwtAuthGuard, JwtModule, TypeOrmModule],
})
export class AuthModule {}
