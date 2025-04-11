// import { IsEmail, IsOptional, IsString } from 'class-validator';
// import { Type } from 'class-transformer';

export class RegisterDto {
  email: string;
  password: string;
  username: string;
  color?: string;
}
