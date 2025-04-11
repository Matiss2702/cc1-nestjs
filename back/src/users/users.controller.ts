import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: FindAllUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(id);
  }
}
