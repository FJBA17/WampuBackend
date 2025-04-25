// src/vehicles/vehicle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../company/company.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, (company) => company.vehicles, { onDelete: 'CASCADE' })
  company: Company;

  @Column({ unique: true })
  plate_number: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  engine_type: string;

  @Column({ nullable: true })
  transmission: string;

  @Column({ type: 'float' })
  mileage: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}