// src/auth/dto/register.dto.ts
import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone?: string;

  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  companyName: string;

  @IsOptional()
  @IsString({ message: 'El RUT de la empresa debe ser una cadena de texto' })
  companyRut?: string;
}

