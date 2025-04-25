import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/company.entity'; // Asegúrate que la ruta sea correcta

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret_key_wampu', // usa .env después
      signOptions: { expiresIn: '8h' },
    }),
    TypeOrmModule.forFeature([Company]), // <--- ESTA LÍNEA ES LA CLAVE
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}