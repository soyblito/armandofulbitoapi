import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
