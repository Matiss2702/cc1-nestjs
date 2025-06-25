import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Type(() => String)
  name: string;
}
