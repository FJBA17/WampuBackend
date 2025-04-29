// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TrackingModule } from './tracking/tracking.module'; // Módulo Tracking

import { Company } from './company/company.entity';
import { User } from './users/user.entity';
import { Vehicle } from './vehicles/vehicles.entity';
import { TrackingRecord } from './tracking/tracking.entity'; // Entidad TrackingRecord
import crypto from 'crypto';
(global as any).crypto = crypto;


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexion a PostgreSQL en Neon usando variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false, // Necesario para Neon
        },
        autoLoadEntities: true,
        synchronize: true,
        logging: true, // Opcional para ver las queries
      }),
    }),

    // Registrar las entidades para usar en los servicios/repositorios
    TypeOrmModule.forFeature([Company, User, Vehicle, TrackingRecord]),

    // Importar tus módulos internos
    AuthModule,
    UsersModule,
    CompanyModule,
    VehiclesModule,
    TrackingModule,
  ],
})
export class AppModule {}
