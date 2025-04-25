// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Company } from '../company/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const company = this.companyRepo.create({
      name: dto.companyName,
      rut: dto.companyRut,
    });
    await this.companyRepo.save(company);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: dto.phone,
      role: 'admin',
      company,
    });

    const payload = { 
      sub: user.id, 
      role: user.role,
      companyId: company.id  // Incluir el ID de la compañía
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { 
      sub: user.id, 
      role: user.role,
      companyId: user.company.id  // Incluir el ID de la compañía
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user };
  }
}