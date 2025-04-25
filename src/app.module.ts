// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Company } from './company/company.entity';
import { User } from './users/user.entity';
import { AuthService } from './auth/auth.service';
import { CompanyModule } from './company/company.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TrackingModule } from './tracking/tracking.module'; // Nuevo módulo
import { Vehicle } from './vehicles/vehicles.entity';
import { TrackingRecord } from './tracking/tracking.entity'; // Nueva entidad

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'DataBaseWampu',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Company, User, Vehicle, TrackingRecord]), // Añadida TrackingRecord
    AuthModule,
    UsersModule,
    CompanyModule,
    VehiclesModule,
    TrackingModule, // Nuevo módulo
  ],
})
export class AppModule {}