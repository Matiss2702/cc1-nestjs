import { IsEmail, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SignInDto {
  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  password: string;
}
