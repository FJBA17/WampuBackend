// src/tracking/dto/create-tracking-record.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, IsDateString, Min, IsOptional } from 'class-validator';

export class CreateTrackingRecordDto {
  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;

  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @IsOptional()
  @IsDateString()
  end_time?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  start_mileage: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  end_mileage: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  distance: number;
}