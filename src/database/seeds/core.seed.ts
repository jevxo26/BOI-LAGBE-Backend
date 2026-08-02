import * as bcrypt from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  User,
  UserStatus,
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
  ActivityType,
  SupportTicket,
} from '../../auth/entities';

/**
 * Seed keys (shared with other domain seeds for FK resolution):
 *   user:staff-1, user:student-1..3, user:customer-1..3,
 *   user:agent-1..2, user:rider-1..2
 */
export async function seedCore(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // One shared hash so every seeded user can log in with the documented password.
  const password = await bcrypt.hash('Password@123', 10);

  // ---------------------------------------------------------------- users
  await seedRows(
    manager,
    User,
    [
      {
        id: uid('user:staff-1'),
        userCode: 'BL-STAFF-001',
        firstName: 'Ayesha',
        lastName: 'Rahman',
        fullName: 'Ayesha Rahman',
        email: 'staff@boilagbe.test',
        phone: '01700000001',
        password,
        roles: ['ADMIN'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
        phoneVerifiedAt: daysFromNow(-60),
        emailVerifiedAt: daysFromNow(-60),
      },
      {
        id: uid('user:student-1'),
        userCode: 'BL-STU-0001',
        firstName: 'Rahim',
        lastName: 'Uddin',
        fullName: 'Rahim Uddin',
        email: 'rahim@boilagbe.test',
        phone: '01700000002',
        password,
        roles: ['STUDENT'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
        phoneVerifiedAt: daysFromNow(-45),
      },
      {
        id: uid('user:student-2'),
        userCode: 'BL-STU-0002',
        firstName: 'Nusrat',
        lastName: 'Jahan',
        fullName: 'Nusrat Jahan',
        email: 'nusrat@boilagbe.test',
        phone: '01700000003',
        password,
        roles: ['STUDENT'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
      {
        id: uid('user:student-3'),
        userCode: 'BL-STU-0003',
        firstName: 'Tanvir',
        lastName: 'Ahmed',
        fullName: 'Tanvir Ahmed',
        email: 'tanvir@boilagbe.test',
        phone: '01700000004',
        password,
        roles: ['STUDENT'],
        status: UserStatus.PENDING,
        isActive: true,
        isVerified: false,
      },
      {
        id: uid('user:customer-1'),
        userCode: 'BL-CUS-0001',
        firstName: 'Farhana',
        lastName: 'Islam',
        fullName: 'Farhana Islam',
        email: 'farhana@boilagbe.test',
        phone: '01700000005',
        password,
        roles: ['STUDENT'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
      {
        id: uid('user:customer-2'),
        userCode: 'BL-CUS-0002',
        firstName: 'Mahmudul',
        lastName: 'Hasan',
        fullName: 'Mahmudul Hasan',
        email: 'mahmud@boilagbe.test',
        phone: '01700000006',
        password,
        roles: ['STUDENT'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
      {
        id: uid('user:customer-3'),
        userCode: 'BL-CUS-0003',
        firstName: 'Sadia',
        lastName: 'Sultana',
        fullName: 'Sadia Sultana',
        email: 'sadia@boilagbe.test',
        phone: '01700000007',
        password,
        roles: ['STUDENT'],
        status: UserStatus.SUSPENDED,
        isActive: false,
        isVerified: true,
      },
      {
        id: uid('user:agent-1'),
        userCode: 'BL-AGT-0001',
        firstName: 'Karim',
        lastName: 'Miah',
        fullName: 'Karim Miah',
        email: 'agent1@boilagbe.test',
        phone: '01700000008',
        password,
        roles: ['AGENT'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
      {
        id: uid('user:agent-2'),
        userCode: 'BL-AGT-0002',
        firstName: 'Shamim',
        lastName: 'Chowdhury',
        fullName: 'Shamim Chowdhury',
        email: 'agent2@boilagbe.test',
        phone: '01700000009',
        password,
        roles: ['AGENT'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
      {
        id: uid('user:rider-1'),
        userCode: 'BL-RDR-0001',
        firstName: 'Jasim',
        lastName: 'Uddin',
        fullName: 'Jasim Uddin',
        email: 'rider1@boilagbe.test',
        phone: '01700000010',
        password,
        roles: ['RIDER'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
      {
        id: uid('user:rider-2'),
        userCode: 'BL-RDR-0002',
        firstName: 'Rafiq',
        lastName: 'Islam',
        fullName: 'Rafiq Islam',
        email: 'rider2@boilagbe.test',
        phone: '01700000011',
        password,
        roles: ['RIDER'],
        status: UserStatus.ACTIVE,
        isActive: true,
        isVerified: true,
      },
    ],
    'users',
  );

  // ----------------------------------------------------------- user_profiles
  await seedRows(
    manager,
    UserProfile,
    [
      {
        id: uid('profile:staff-1'),
        userId: uid('user:staff-1'),
        gender: 'FEMALE',
        bloodGroup: 'O+',
        occupation: 'Admin Officer',
      },
      {
        id: uid('profile:student-1'),
        userId: uid('user:student-1'),
        gender: 'MALE',
        bloodGroup: 'B+',
        occupation: 'Student',
      },
      {
        id: uid('profile:student-2'),
        userId: uid('user:student-2'),
        gender: 'FEMALE',
        bloodGroup: 'A+',
        occupation: 'Student',
      },
      {
        id: uid('profile:customer-1'),
        userId: uid('user:customer-1'),
        gender: 'FEMALE',
        occupation: 'Teacher',
      },
      {
        id: uid('profile:agent-1'),
        userId: uid('user:agent-1'),
        gender: 'MALE',
        occupation: 'Book Agent',
      },
      {
        id: uid('profile:rider-1'),
        userId: uid('user:rider-1'),
        gender: 'MALE',
        occupation: 'Delivery Rider',
      },
    ],
    'user_profiles',
  );

  // ---------------------------------------------------------- student_profiles
  await seedRows(
    manager,
    StudentProfile,
    [
      {
        id: uid('studentprofile:student-1'),
        userId: uid('user:student-1'),
        studentId: '2021-2-60-001',
        batch: '2021',
        section: 'A',
        rollNumber: '01',
        registrationNumber: 'REG-0001',
        graduationYear: 2025,
      },
      {
        id: uid('studentprofile:student-2'),
        userId: uid('user:student-2'),
        studentId: '2022-2-60-002',
        batch: '2022',
        section: 'B',
        rollNumber: '02',
        registrationNumber: 'REG-0002',
        graduationYear: 2026,
      },
      {
        id: uid('studentprofile:student-3'),
        userId: uid('user:student-3'),
        studentId: '2023-2-60-003',
        batch: '2023',
        section: 'A',
        rollNumber: '03',
        registrationNumber: 'REG-0003',
        graduationYear: 2027,
      },
    ],
    'student_profiles',
  );

  // ------------------------------------------------------------- user_addresses
  await seedRows(
    manager,
    UserAddress,
    [
      {
        id: uid('address:student-1-home'),
        userId: uid('user:student-1'),
        addressType: 'HOME',
        receiverName: 'Rahim Uddin',
        receiverPhone: '01700000002',
        countryId: uid('country:bd'),
        divisionId: uid('division:dhaka'),
        districtId: uid('district:dhaka'),
        upazilaId: uid('upazila:dhanmondi'),
        areaId: uid('area:dhanmondi'),
        road: 'Road 5',
        house: 'House 12',
        postalCode: '1205',
        isDefault: true,
      },
      {
        id: uid('address:student-2-hostel'),
        userId: uid('user:student-2'),
        addressType: 'HOSTEL',
        receiverName: 'Nusrat Jahan',
        receiverPhone: '01700000003',
        countryId: uid('country:bd'),
        divisionId: uid('division:dhaka'),
        districtId: uid('district:dhaka'),
        upazilaId: uid('upazila:mirpur'),
        areaId: uid('area:mirpur'),
        hostel: 'Hall 2',
        roomNumber: '204',
        postalCode: '1216',
        isDefault: true,
      },
      {
        id: uid('address:customer-1-home'),
        userId: uid('user:customer-1'),
        addressType: 'HOME',
        receiverName: 'Farhana Islam',
        receiverPhone: '01700000005',
        countryId: uid('country:bd'),
        divisionId: uid('division:dhaka'),
        districtId: uid('district:dhaka'),
        upazilaId: uid('upazila:uttara'),
        areaId: uid('area:uttara'),
        road: 'Road 4',
        house: 'Flat 3B',
        postalCode: '1230',
        isDefault: true,
      },
    ],
    'user_addresses',
  );

  // --------------------------------------------------------------- user_devices
  await seedRows(
    manager,
    UserDevice,
    [
      {
        id: uid('device:student-1'),
        userId: uid('user:student-1'),
        deviceId: 'dev-android-001',
        deviceName: 'Samsung Galaxy',
        deviceType: 'ANDROID',
        operatingSystem: 'Android',
        osVersion: '14',
        browser: 'Chrome',
        appVersion: '1.2.0',
      },
      {
        id: uid('device:customer-1'),
        userId: uid('user:customer-1'),
        deviceId: 'dev-ios-001',
        deviceName: 'iPhone 15',
        deviceType: 'IOS',
        operatingSystem: 'iOS',
        osVersion: '17',
        browser: 'Safari',
        appVersion: '1.2.0',
      },
      {
        id: uid('device:staff-1'),
        userId: uid('user:staff-1'),
        deviceId: 'dev-web-001',
        deviceName: 'Chrome / Windows',
        deviceType: 'WEB',
        operatingSystem: 'Windows',
        browser: 'Chrome',
      },
    ],
    'user_devices',
  );

  // -------------------------------------------------------------- user_sessions
  await seedRows(
    manager,
    UserSession,
    [
      {
        id: uid('session:student-1'),
        userId: uid('user:student-1'),
        accessToken: 'seed-access-token-1',
        refreshToken: 'seed-refresh-token-1',
        deviceId: 'dev-android-001',
        loginAt: daysFromNow(-1),
        expiresAt: daysFromNow(1),
        status: 'ACTIVE',
      },
      {
        id: uid('session:customer-1'),
        userId: uid('user:customer-1'),
        accessToken: 'seed-access-token-2',
        refreshToken: 'seed-refresh-token-2',
        deviceId: 'dev-ios-001',
        loginAt: daysFromNow(-2),
        expiresAt: daysFromNow(1),
        status: 'ACTIVE',
      },
    ],
    'user_sessions',
  );

  // ------------------------------------------------------------------ user_otps
  await seedRows(
    manager,
    UserOTP,
    [
      {
        id: uid('otp:student-1'),
        userId: uid('user:student-1'),
        otp: '123456',
        purpose: 'LOGIN',
        status: 'VERIFIED',
        expiresAt: daysFromNow(-1),
        verifiedAt: daysFromNow(-2),
      },
      {
        id: uid('otp:student-3'),
        userId: uid('user:student-3'),
        otp: '654321',
        purpose: 'REGISTER',
        status: 'PENDING',
        expiresAt: daysFromNow(1),
      },
    ],
    'user_otps',
  );

  // ----------------------------------------------------------------- user_tokens
  await seedRows(
    manager,
    UserToken,
    [
      {
        id: uid('token:student-1'),
        userId: uid('user:student-1'),
        token: 'seed-verify-token-1',
        tokenType: 'EMAIL_VERIFY',
        expiresAt: daysFromNow(1),
        usedAt: daysFromNow(-2),
      },
      {
        id: uid('token:customer-2'),
        userId: uid('user:customer-2'),
        token: 'seed-reset-token-1',
        tokenType: 'PASSWORD_RESET',
        expiresAt: daysFromNow(-1),
        usedAt: daysFromNow(-2),
      },
    ],
    'user_tokens',
  );

  // ---------------------------------------------------------- user_login_histories
  await seedRows(
    manager,
    UserLoginHistory,
    [
      {
        id: uid('loginhist:student-1'),
        userId: uid('user:student-1'),
        deviceId: 'dev-android-001',
        ipAddress: '127.0.0.1',
        browser: 'Chrome',
        operatingSystem: 'Android',
        loginTime: daysFromNow(-1),
        logoutTime: daysFromNow(-1),
        location: 'Dhaka',
        status: 'SUCCESS',
      },
      {
        id: uid('loginhist:staff-1'),
        userId: uid('user:staff-1'),
        deviceId: 'dev-web-001',
        ipAddress: '127.0.0.1',
        browser: 'Chrome',
        operatingSystem: 'Windows',
        loginTime: daysFromNow(0),
        location: 'Dhaka',
        status: 'SUCCESS',
      },
    ],
    'user_login_histories',
  );

  // ------------------------------------------------------------- user_securities
  await seedRows(
    manager,
    UserSecurity,
    [
      {
        id: uid('security:staff-1'),
        userId: uid('user:staff-1'),
        twoFactorEnabled: false,
        failedLoginAttempt: 0,
        accountLocked: false,
        passwordChangedAt: daysFromNow(-30),
      },
      {
        id: uid('security:student-1'),
        userId: uid('user:student-1'),
        twoFactorEnabled: false,
        failedLoginAttempt: 0,
        accountLocked: false,
        passwordChangedAt: daysFromNow(-40),
      },
      {
        id: uid('security:customer-3'),
        userId: uid('user:customer-3'),
        twoFactorEnabled: false,
        failedLoginAttempt: 3,
        accountLocked: true,
        passwordChangedAt: daysFromNow(-10),
      },
    ],
    'user_securities',
  );

  // ------------------------------------------------------------ user_preferences
  await seedRows(
    manager,
    UserPreference,
    [
      {
        id: uid('pref:student-1'),
        userId: uid('user:student-1'),
        language: 'bn',
        currency: 'BDT',
        theme: 'light',
        timezone: 'Asia/Dhaka',
        favoriteCategory: 'Academic',
      },
      {
        id: uid('pref:customer-1'),
        userId: uid('user:customer-1'),
        language: 'en',
        currency: 'BDT',
        theme: 'dark',
        timezone: 'Asia/Dhaka',
        favoriteCategory: 'Novel',
      },
    ],
    'user_preferences',
  );

  // ------------------------------------------------- user_notification_settings
  await seedRows(
    manager,
    UserNotificationSetting,
    [
      {
        id: uid('notifsetting:student-1'),
        userId: uid('user:student-1'),
        pushNotification: true,
        emailNotification: true,
        smsNotification: false,
        marketingNotification: true,
        orderNotification: true,
        systemNotification: true,
      },
      {
        id: uid('notifsetting:customer-1'),
        userId: uid('user:customer-1'),
        pushNotification: true,
        emailNotification: true,
        smsNotification: true,
        marketingNotification: false,
        orderNotification: true,
        systemNotification: true,
      },
    ],
    'user_notification_settings',
  );

  // ---------------------------------------------- user_identity_verifications
  await seedRows(
    manager,
    UserIdentityVerification,
    [
      {
        id: uid('identity:student-1'),
        userId: uid('user:student-1'),
        documentType: 'STUDENT_ID',
        documentNumber: '2021-2-60-001',
        frontImage: '/uploads/id/front-1.jpg',
        backImage: '/uploads/id/back-1.jpg',
        verificationStatus: 'APPROVED',
        verifiedBy: uid('user:staff-1'),
        verifiedAt: daysFromNow(-20),
      },
      {
        id: uid('identity:customer-3'),
        userId: uid('user:customer-3'),
        documentType: 'NID',
        documentNumber: 'NID-0003',
        frontImage: '/uploads/id/front-3.jpg',
        verificationStatus: 'PENDING',
      },
    ],
    'user_identity_verifications',
  );

  // ----------------------------------------------------------- user_attachments
  await seedRows(
    manager,
    UserAttachment,
    [
      {
        id: uid('attach:student-1'),
        userId: uid('user:student-1'),
        fileName: 'result-sheet.pdf',
        fileType: 'application/pdf',
        fileUrl: '/uploads/user/result-sheet.pdf',
        fileSize: 245760,
        uploadedBy: uid('user:student-1'),
      },
    ],
    'user_attachments',
  );

  // ------------------------------------------------------------ user_activities
  await seedRows(
    manager,
    UserActivity,
    [
      {
        id: uid('activity:student-1-reg'),
        userId: uid('user:student-1'),
        activity: ActivityType.REGISTER,
        ipAddress: '127.0.0.1',
        device: 'Android',
        createdAt: daysFromNow(-45),
      },
      {
        id: uid('activity:student-1-login'),
        userId: uid('user:student-1'),
        activity: ActivityType.LOGIN,
        ipAddress: '127.0.0.1',
        device: 'Android',
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('activity:customer-1-order'),
        userId: uid('user:customer-1'),
        activity: ActivityType.CREATE_ORDER,
        referenceType: 'order',
        referenceId: uid('order:1'),
        ipAddress: '127.0.0.1',
        createdAt: daysFromNow(-3),
      },
    ],
    'user_activities',
  );

  // ----------------------------------------------------------- support_tickets
  await seedRows(
    manager,
    SupportTicket,
    [
      {
        id: uid('support:1'),
        ticketNumber: 'SUP-2026-0001',
        userId: uid('user:student-1'),
        category: 'ORDER',
        priority: 'HIGH',
        subject: 'Order not delivered',
        description: 'My order was placed 10 days ago but has not arrived.',
        status: 'OPEN',
      },
      {
        id: uid('support:2'),
        ticketNumber: 'SUP-2026-0002',
        userId: uid('user:customer-1'),
        category: 'PAYMENT',
        priority: 'MEDIUM',
        subject: 'Payment issue',
        description: 'Payment deducted twice for the same order.',
        status: 'IN_PROGRESS',
      },
      {
        id: uid('support:3'),
        ticketNumber: 'SUP-2026-0003',
        userId: uid('user:customer-2'),
        category: 'BOOK',
        priority: 'LOW',
        subject: 'Wrong book received',
        description: 'Received a different edition than ordered.',
        status: 'RESOLVED',
      },
    ],
    'support_tickets',
  );

  void ctx;
}
