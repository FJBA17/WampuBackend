// src/tracking/tracking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vehicle } from '../vehicles/vehicles.entity';

@Entity('tracking_records')
export class TrackingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @Column('timestamp')
  start_time: Date;

  @Column('timestamp', { nullable: true })
  end_time?: Date; // Cambiado a opcional con '?'

  @Column('float')
  start_mileage: number;

  @Column('float')
  end_mileage: number;

  @Column('float')
  distance: number;

  @CreateDateColumn()
  created_at: Date;
}