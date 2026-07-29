import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession, SessionStatus } from '../entities';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class StrictJwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if endpoint is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // 2. Extract Token from HTTP-Only Cookie or Authorization Header
    let token = request.cookies?.['access_token'];
    if (!token && request.headers.authorization) {
      token = request.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Access Denied. JWT Token is missing.',
        error: 'Unauthorized',
      });
    }

    // 3. Verify JWT Signature & Expiry
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecret_jwt_access_key',
      });
    } catch (err) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid or expired JWT token.',
        error: 'Unauthorized',
      });
    }

    // 4. Verify Active Session in Database (Revocation Check)
    if (payload.sessionId) {
      const session = await this.sessionRepository.findOne({
        where: { id: payload.sessionId },
      });

      if (!session || session.status !== SessionStatus.ACTIVE) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Session has been revoked or logged out.',
          error: 'Unauthorized',
        });
      }
    }

    // Attach validated user context to request
    request['user'] = {
      id: payload.sub,
      email: payload.email,
      phone: payload.phone,
      roles: payload.roles,
      sessionId: payload.sessionId,
    };

    return true;
  }
}
