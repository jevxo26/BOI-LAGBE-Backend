import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import {
  User,
  UserOTP,
  UserSession,
  UserLoginHistory,
  UserDevice,
  UserActivity,
  ActivityType,
} from './entities';
import { DataSource } from 'typeorm';

// Security regression tests: public registration must NEVER accept a
// client-supplied `roles` value. A previous version of the flow let anyone
// register with roles:['ADMIN'] and mint a full-admin JWT (privilege
// escalation). The DTO no longer exposes `roles` (forbidNonWhitelisted
// rejects it) and the service hardcodes ['STUDENT'].
describe('AuthService.register (privilege escalation fix)', () => {
  let service: AuthService;

  const userRepository = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const saveMock = jest.fn();
  const queryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      create: jest.fn().mockImplementation((_entity, data) => data),
      save: saveMock,
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    saveMock.mockReset();

    const dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(UserOTP), useValue: {} },
        { provide: getRepositoryToken(UserSession), useValue: {} },
        { provide: getRepositoryToken(UserLoginHistory), useValue: {} },
        { provide: getRepositoryToken(UserDevice), useValue: {} },
        { provide: getRepositoryToken(UserActivity), useValue: {} },
        { provide: DataSource, useValue: dataSource },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('creates the user with roles ["STUDENT"] even when roles:["ADMIN"] is smuggled in', async () => {
    // NOTE: the DTO strips unknown props, but the service must still be safe
    // if called with a raw object (defense in depth).
    const dto = {
      firstName: 'Evil',
      lastName: 'Admin',
      email: 'evil@test.com',
      phone: '01710000000',
      password: 'secret123',
      roles: ['ADMIN'],
    } as unknown as RegisterDto;

    saveMock
      .mockResolvedValueOnce({
        id: 'user-1',
        userCode: 'BL-123456',
        fullName: 'Evil Admin',
        email: 'evil@test.com',
        phone: '01710000000',
        roles: ['STUDENT'],
        status: 'PENDING',
      })
      .mockResolvedValue({});

    const result = await service.register(dto);

    // The saved user row must never carry ADMIN
    const savedUser = queryRunner.manager.create.mock.calls.find(
      ([entity]) => entity === User,
    );
    expect(savedUser).toBeDefined();
    expect(savedUser[1].roles).toEqual(['STUDENT']);

    expect(result.user.roles).toEqual(['STUDENT']);
    expect(saveMock).toHaveBeenCalled();
  });

  it('creates a STUDENT profile when roles are not supplied', async () => {
    const dto = {
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '01720000000',
      password: 'secret123',
    } as RegisterDto;

    saveMock
      .mockResolvedValueOnce({
        id: 'user-2',
        userCode: 'BL-654321',
        fullName: 'Jane Doe',
        phone: '01720000000',
        roles: ['STUDENT'],
        status: 'PENDING',
      })
      .mockResolvedValue({});

    const result = await service.register(dto);

    expect(result.user.roles).toEqual(['STUDENT']);
    const savedUser = queryRunner.manager.create.mock.calls.find(
      ([entity]) => entity === User,
    );
    expect(savedUser[1].roles).toEqual(['STUDENT']);

    // STUDENT default should also trigger StudentProfile creation
    const studentProfile = queryRunner.manager.create.mock.calls.find(
      ([entity]) => (entity as { name?: string }).name === 'StudentProfile',
    );
    expect(studentProfile).toBeDefined();
  });

  it('records a REGISTER activity for the new user', async () => {
    const dto = {
      firstName: 'Bob',
      lastName: 'Smith',
      phone: '01730000000',
      password: 'secret123',
    } as RegisterDto;

    saveMock
      .mockResolvedValueOnce({
        id: 'user-3',
        userCode: 'BL-111111',
        fullName: 'Bob Smith',
        phone: '01730000000',
        roles: ['STUDENT'],
        status: 'PENDING',
      })
      .mockResolvedValue({});

    await service.register(dto);

    const activity = queryRunner.manager.create.mock.calls.find(
      ([entity]) => entity === UserActivity,
    );
    expect(activity).toBeDefined();
    expect(activity[1].activity).toBe(ActivityType.REGISTER);
  });
});
