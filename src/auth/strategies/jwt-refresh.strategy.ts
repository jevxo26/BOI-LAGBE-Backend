import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token: string | null = null;
          if (request && request.cookies) {
            token = request.cookies['refresh_token'] || null;
          }
          if (!token && request.headers['x-refresh-token']) {
            token = (request.headers['x-refresh-token'] as string) || null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'supersecret_jwt_refresh_key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    let refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken && req.headers['x-refresh-token']) {
      refreshToken = req.headers['x-refresh-token'] as string;
    }
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      sessionId: payload.sessionId,
      refreshToken,
    };
  }
}
