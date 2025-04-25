// src/tracking/tracking.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingRecord } from './tracking.entity';
import { Vehicle } from '../vehicles/vehicles.entity';
import { CreateTrackingRecordDto } from './dto/create-tracking-record.dto';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(
    @InjectRepository(TrackingRecord)
    private readonly trackingRepository: Repository<TrackingRecord>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createTrackingDto: CreateTrackingRecordDto, companyId: string): Promise<TrackingRecord> {
    // Verificar que el vehículo existe y pertenece a la compañía
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createTrackingDto.vehicleId },
      relations: ['company'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    if (vehicle.company.id !== companyId) {
      throw new BadRequestException('No tienes permisos para este vehículo');
    }

    // Validar que la distancia sea coherente con el kilometraje
    const mileageDifference = createTrackingDto.end_mileage - createTrackingDto.start_mileage;
    if (Math.abs(mileageDifference - createTrackingDto.distance) > 0.5) {
      this.logger.warn(`Discrepancia en distancia: Diferencia de KM=${mileageDifference}, Distancia reportada=${createTrackingDto.distance}`);
    }

    // Crear un nuevo registro de seguimiento
    const trackingRecord = new TrackingRecord();
    trackingRecord.vehicle = vehicle;
    trackingRecord.start_time = new Date(createTrackingDto.start_time);
    // Manejar el end_time correctamente para evitar problemas con null
    trackingRecord.end_time = createTrackingDto.end_time ? new Date(createTrackingDto.end_time) : undefined;
    trackingRecord.start_mileage = createTrackingDto.start_mileage;
    trackingRecord.end_mileage = createTrackingDto.end_mileage;
    trackingRecord.distance = createTrackingDto.distance;

    this.logger.log(`Creando registro de seguimiento para vehículo ${createTrackingDto.vehicleId}. Distancia: ${createTrackingDto.distance} km`);
    return await this.trackingRepository.save(trackingRecord);
  }

  async findAllByVehicle(vehicleId: string, companyId: string): Promise<TrackingRecord[]> {
    // Verificar que el vehículo existe y pertenece a la compañía
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ['company'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    if (vehicle.company.id !== companyId) {
      throw new BadRequestException('No tienes permisos para este vehículo');
    }

    this.logger.log(`Consultando registros de seguimiento para vehículo ${vehicleId}`);
    return await this.trackingRepository.find({
      where: { vehicle: { id: vehicleId } },
      order: { start_time: 'DESC' },
    });
  }

  async getVehicleStatistics(vehicleId: string, companyId: string): Promise<any> {
    // Verificar que el vehículo existe y pertenece a la compañía
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ['company'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    if (vehicle.company.id !== companyId) {
      throw new BadRequestException('No tienes permisos para este vehículo');
    }

    // Encontrar todos los registros de seguimiento
    const records = await this.trackingRepository.find({
      where: { vehicle: { id: vehicleId } },
    });

    // Calcular estadísticas
    const totalDistance = records.reduce((sum, record) => sum + record.distance, 0);
    const totalTime = records.reduce((sum, record) => {
      if (record.end_time) {
        return sum + (new Date(record.end_time).getTime() - new Date(record.start_time).getTime());
      }
      return sum;
    }, 0);

    // Convertir tiempo de milisegundos a horas
    const totalHours = totalTime / (1000 * 60 * 60);
    
    // Calcular velocidad promedio (km/h) si hay tiempo registrado
    const averageSpeed = totalHours > 0 ? totalDistance / totalHours : 0;

    this.logger.log(`Estadísticas calculadas para vehículo ${vehicleId}: Distancia total=${totalDistance}km, Tiempo total=${totalHours}h`);
    
    return {
      totalRecords: records.length,
      totalDistance,
      totalHours,
      averageSpeed,
      currentMileage: vehicle.mileage,
    };
  }
}