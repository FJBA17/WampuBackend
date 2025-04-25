// src/vehicles/vehicles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './vehicles.entity';
import { Company } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Company])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}