import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  email?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  username?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  color?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  password?: string;
}
