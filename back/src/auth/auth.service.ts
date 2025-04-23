import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  color?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, pass: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Email incorrect');
      }

      const passwordMatches = await bcrypt.compare(pass, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        color: user.color ?? undefined,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      return { access_token: token };
    } catch (error) {
      console.error('Erreur dans signIn:', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crée le nouvel utilisateur
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        color: registerDto.color ?? undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        color: true,
      },
    });

    /* 
    Création d'un chat 1v1 avec chaque utilisateur existant
    */
    // Récupère tous les autres utilisateurs
    const otherUsers = await this.prisma.user.findMany({
      where: {
        id: {
          not: newUser.id,
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    // Crée un chat 1v1 avec chaque utilisateur existant
    await Promise.all(
      otherUsers.map((otherUser) =>
        this.prisma.chat.create({
          data: {
            is_group: false,
            name: `Chat ${newUser.username} - ${otherUser.username}`,
            members: {
              create: [
                {
                  userId: newUser.id,
                },
                {
                  userId: otherUser.id,
                },
              ],
            },
          },
        }),
      ),
    );
    return newUser;
  }
}
