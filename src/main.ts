import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GlobalHttpExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Production Security Headers (Helmet)
  app.use(helmet());

  // 2. Global Rate Limiter (Brute-Force & DDOS Protection: Max 100 requests per 15 mins per IP)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Too many requests from this IP, please try again after 15 minutes.',
      },
    }),
  );

  // 3. Global Cookie Parser
  app.use(cookieParser());

  // 4. Global Validation Pipe with strict DTO sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Global Standard Exception Filter (Handles 401, 400, 429, 500 cleanly)
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // 6. Global API Versioning Prefix
  app.setGlobalPrefix('api/v1');

  // 7. Strict CORS Configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token', 'X-Requested-With'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🔒 Enterprise SaaS Security Active on http://localhost:${port}/api/v1`);
}
bootstrap();
