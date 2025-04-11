import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Type(() => String)
  name: string;
}
