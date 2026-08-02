import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GlobalHttpExceptionFilter } from './../src/common/filters/global-exception.filter';
import { JwtService } from '@nestjs/jwt';

// E2E regression suite for the auth/authorization matrix. Mirrors the
// production bootstrap from main.ts (global prefix, ValidationPipe with
// forbidNonWhitelisted, exception filter). Guards come from AppModule's
// global APP_GUARD registration.
//
// NOTE: tokens are signed directly with JwtService (no sessionId claim) so
// the StrictJwtAuthGuard verifies signature/roles without a DB session lookup,
// exercising the exact guard chain the API uses.
describe('Auth matrix (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  const sign = (roles: string[]) =>
    jwtService.sign(
      { sub: '00000000-0000-0000-0000-000000000000', roles },
      { secret: process.env.JWT_SECRET || 'supersecret_jwt_access_key' },
    );

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    await app.init();

    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1 (root) is public and returns 200', async () => {
    await request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect('Hello World!');
  });

  it('register with a client-supplied roles array is rejected (400)', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Escalation',
        lastName: 'Attempt',
        email: 'escalation-attempt@test.local',
        phone: '01990000001',
        password: 'secret123',
        roles: ['ADMIN'],
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(
          expect.arrayContaining(['property roles should not exist']),
        );
      });
  });

  it('GET /api/v1/auth/me without token → 401', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('GET /api/v1/admin/users without token → 401', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/users').expect(401);
  });

  it('admin route with a non-admin (STUDENT) token → 403', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${sign(['STUDENT'])}`)
      .expect(403);
  });

  it('admin route with an ADMIN token → 200', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/admin/users?page=1&limit=1')
      .set('Authorization', `Bearer ${sign(['ADMIN'])}`)
      .expect(200);
  });

  it('admin route with a SUPER_ADMIN token → 200', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/admin/users?page=1&limit=1')
      .set('Authorization', `Bearer ${sign(['SUPER_ADMIN'])}`)
      .expect(200);
  });

  it('invalid/tampered token → 401', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer not.a.valid.token')
      .expect(401);
  });
});
