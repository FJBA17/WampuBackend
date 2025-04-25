// src/auth/dto/login.dto.ts
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}