import { IsEmail, IsString, MinLength, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  nombreCompleto: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  roles?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}