// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt_secret_key_wampu', // mueve a .env en producción
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      role: payload.role,
      companyId: payload.companyId // Incluir el ID de la compañía
    };
  }
}