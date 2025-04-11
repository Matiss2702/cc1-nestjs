import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  password: string;

  @IsString()
  @Type(() => String)
  username: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  color?: string;
}
