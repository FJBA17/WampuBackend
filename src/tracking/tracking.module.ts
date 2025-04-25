// src/tracking/tracking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TrackingRecord } from './tracking.entity';
import { Vehicle } from '../vehicles/vehicles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingRecord, Vehicle])],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}