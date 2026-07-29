import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Public endpoints that do NOT require token
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/send-otp',
  '/auth/verify-otp',
  '/auth/refresh-token',
];

@Injectable()
export class TokenRequiredInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path || request.url;

    // Check if the current route is public
    const isPublic = PUBLIC_ROUTES.some((route) => path.startsWith(route));
    if (isPublic) {
      return next.handle();
    }

    // Extract Token from Cookie or Bearer Header
    let token = request.cookies?.['access_token'];
    if (!token && request.headers.authorization) {
      token = request.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Access denied. Token is missing from request.',
        error: 'Unauthorized',
      });
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'supersecret_jwt_access_key',
      });
      request['user'] = {
        id: payload.sub,
        email: payload.email,
        phone: payload.phone,
        roles: payload.roles,
        sessionId: payload.sessionId,
      };
    } catch (error) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Token verification failed or token expired.',
        error: 'Unauthorized',
      });
    }

    return next.handle();
  }
}
