// src/vehicles/vehicles.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { VehiclesService } from './vehicles.service';
  import { CreateVehicleDto } from './dto/create-vehicle.dto';
  import { UpdateVehicleDto } from './dto/update-vehicle.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('vehicles')
  @UseGuards(JwtAuthGuard) // Proteger todas las rutas con autenticación JWT
  export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}
  
    @Post()
    create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
      // Obtener el ID de la compañía del usuario autenticado
      const companyId = req.user.companyId;
      return this.vehiclesService.create(createVehicleDto, companyId);
    }
  
    @Get()
    findAll(@Request() req) {
      // Obtener solo los vehículos de la compañía del usuario autenticado
      const companyId = req.user.companyId;
      return this.vehiclesService.findAllByCompany(companyId);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
      // Verificar que el vehículo pertenezca a la compañía del usuario
      const companyId = req.user.companyId;
      return this.vehiclesService.findOne(id, companyId);
    }
  
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateVehicleDto: UpdateVehicleDto,
      @Request() req,
    ) {
      const companyId = req.user.companyId;
      return this.vehiclesService.update(id, updateVehicleDto, companyId);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
      const companyId = req.user.companyId;
      return this.vehiclesService.remove(id, companyId);
    }
  }