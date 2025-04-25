// src/vehicles/dto/create-vehicle.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty({ message: 'La patente es obligatoria' })
  @IsString()
  plate_number: string;

  @IsNotEmpty({ message: 'La marca es obligatoria' })
  @IsString()
  brand: string;

  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  @IsString()
  model: string;

  @IsNotEmpty({ message: 'El año es obligatorio' })
  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(1900, { message: 'El año debe ser como mínimo 1900' })
  @Max(new Date().getFullYear() + 1, { message: 'El año no puede ser mayor al año siguiente' })
  year: number;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  engine_type?: string;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsNotEmpty({ message: 'El kilometraje es obligatorio' })
  @IsInt({ message: 'El kilometraje debe ser un número entero' })
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  mileage: number;
}

