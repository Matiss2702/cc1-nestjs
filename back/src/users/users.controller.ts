import { Controller, Get, Query } from '@nestjs/common';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindAllResponse, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: FindAllUsersDto): Promise<FindAllResponse> {
    return this.usersService.findAll(query);
  }

  // Exemples (commentés) :
  // @Get(':id')
  // findOne(@Param('id') id: string) { ... }

  // @Post()
  // create(@Body() body: CreateUserDto) { ... }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() body: UpdateUserDto) { ... }

  // @Delete(':id')
  // delete(@Param('id') id: string) { ... }
}
