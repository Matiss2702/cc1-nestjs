import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

export interface FindAllResponse {
  data: User[];
  page: number;
  limit: number;
}

interface FindAllQueryParams {
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(queryParams: FindAllQueryParams): Promise<FindAllResponse> {
    const { page, limit } = queryParams;
    const data = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, page, limit };
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
