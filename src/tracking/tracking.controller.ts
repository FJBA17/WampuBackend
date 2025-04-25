// src/tracking/tracking.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    Logger,
  } from '@nestjs/common';
  import { TrackingService } from './tracking.service';
  import { CreateTrackingRecordDto } from './dto/create-tracking-record.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('tracking')
  @UseGuards(JwtAuthGuard)
  export class TrackingController {
    private readonly logger = new Logger(TrackingController.name);
  
    constructor(private readonly trackingService: TrackingService) {}
  
    @Post()
    create(@Body() createTrackingDto: CreateTrackingRecordDto, @Request() req) {
      const companyId = req.user.companyId;
      this.logger.log(`Solicitud de creación de registro de seguimiento para vehículo: ${createTrackingDto.vehicleId}`);
      return this.trackingService.create(createTrackingDto, companyId);
    }
  
    @Get('vehicle/:id')
    findAllByVehicle(@Param('id') id: string, @Request() req) {
      const companyId = req.user.companyId;
      this.logger.log(`Solicitud de registros de seguimiento para vehículo: ${id}`);
      return this.trackingService.findAllByVehicle(id, companyId);
    }
  
    @Get('statistics/vehicle/:id')
    getVehicleStatistics(@Param('id') id: string, @Request() req) {
      const companyId = req.user.companyId;
      this.logger.log(`Solicitud de estadísticas para vehículo: ${id}`);
      return this.trackingService.getVehicleStatistics(id, companyId);
    }
  }