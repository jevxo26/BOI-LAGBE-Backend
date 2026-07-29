import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StrictJwtAuthGuard } from './auth/guards/strict-jwt-auth.guard';
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
} from './auth/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [
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
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable Global Strict Auth Guard: EVERY endpoint is protected by default unless decorated with @Public()
    {
      provide: APP_GUARD,
      useClass: StrictJwtAuthGuard,
    },
  ],
})
export class AppModule {}
