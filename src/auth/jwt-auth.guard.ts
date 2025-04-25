// src/auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Añade aquí cualquier lógica personalizada antes de la validación JWT
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Puedes personalizar el manejo de errores aquí
    if (err || !user) {
      throw err || new UnauthorizedException('No estás autenticado para acceder a este recurso');
    }
    return user;
  }
}