// src/vehicles/vehicles.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicles.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Company } from '../company/company.entity';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, companyId: string): Promise<Vehicle> {
    // Verificar si la patente ya existe
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate_number: createVehicleDto.plate_number },
    });

    if (existingVehicle) {
      throw new BadRequestException('Ya existe un vehículo con esta patente');
    }

    // Buscar la compañía
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    // Crear y guardar el vehículo
    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      company,
    });

    this.logger.log(`Creando nuevo vehículo: ${createVehicleDto.brand} ${createVehicleDto.model} - ${createVehicleDto.plate_number}`);
    return await this.vehicleRepository.save(vehicle);
  }

  async findAllByCompany(companyId: string): Promise<Vehicle[]> {
    this.logger.log(`Consultando vehículos para compañía: ${companyId}`);
    return await this.vehicleRepository.find({
      where: { company: { id: companyId } },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string): Promise<Vehicle> {
    this.logger.log(`Consultando vehículo ID: ${id} para compañía: ${companyId}`);
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!vehicle) {
      this.logger.warn(`Vehículo no encontrado: ${id}`);
      throw new NotFoundException('Vehículo no encontrado');
    }

    // Verificar que el vehículo pertenezca a la compañía del usuario
    if (vehicle.company.id !== companyId) {
      this.logger.warn(`Intento no autorizado de acceder al vehículo ${id} desde compañía ${companyId}`);
      throw new ForbiddenException('No tienes permisos para ver este vehículo');
    }

    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
    companyId: string,
  ): Promise<Vehicle> {
    this.logger.log(`Actualizando vehículo ID: ${id}, datos: ${JSON.stringify(updateVehicleDto)}`);
    
    // Primero verificar que el vehículo existe y pertenece a la compañía
    const existingVehicle = await this.findOne(id, companyId);

    // Si se está actualizando la patente, verificar que no exista ya
    if (updateVehicleDto.plate_number) {
      const vehicleWithPlate = await this.vehicleRepository.findOne({
        where: { plate_number: updateVehicleDto.plate_number },
      });

      if (vehicleWithPlate && vehicleWithPlate.id !== id) {
        throw new BadRequestException('Ya existe un vehículo con esta patente');
      }
    }

    // Verificar y validar el kilometraje
    if (updateVehicleDto.mileage !== undefined) {
      this.logger.log(`Actualizando kilometraje para vehículo ${id}: ${existingVehicle.mileage} → ${updateVehicleDto.mileage}`);
      
      if (updateVehicleDto.mileage < 0) {
        this.logger.warn(`Intento de establecer kilometraje negativo: ${updateVehicleDto.mileage}`);
        throw new BadRequestException('El kilometraje no puede ser negativo');
      }
      
      // Si el nuevo kilometraje es menor que el actual (sin ser 0), verificamos
      // Pero permitimos reinicios (valores 0)
      if (updateVehicleDto.mileage > 0 && 
          existingVehicle.mileage > 0 && 
          updateVehicleDto.mileage < existingVehicle.mileage) {
        this.logger.warn(`Intento de reducir kilometraje: ${existingVehicle.mileage} → ${updateVehicleDto.mileage}`);
        
        // Diferencia muy grande: Probablemente un error - Rechazar actualización
        if (existingVehicle.mileage - updateVehicleDto.mileage > 100) {
          throw new BadRequestException(
            'El nuevo kilometraje no puede ser menor que el actual por más de 100 km'
          );
        }
        
        // Si la diferencia es pequeña, podría ser un error de redondeo o GPS - Permitir
        this.logger.log(`Permitiendo actualización con ligera reducción de kilometraje: ${existingVehicle.mileage - updateVehicleDto.mileage} km`);
      }
    }

    // Actualizar el vehículo
    await this.vehicleRepository.update(id, updateVehicleDto);
    this.logger.log(`Vehículo ${id} actualizado correctamente`);

    // Devolver el vehículo actualizado
    return await this.findOne(id, companyId);
  }

  async remove(id: string, companyId: string): Promise<void> {
    // Verificar que el vehículo existe y pertenece a la compañía
    await this.findOne(id, companyId);

    // Eliminar el vehículo
    this.logger.log(`Eliminando vehículo ID: ${id}`);
    await this.vehicleRepository.delete(id);
  }
}