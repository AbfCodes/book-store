import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  signToken(id: string): string {
    return sign({ id }, this.configService.get('JWT_SECRET'), {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
  }

  createSendToken(user: User) {
    const token = this.signToken(user.id);

    // Remove password from output
    user.password = undefined;

    return { token, user };
  }

  async create(
    data: Prisma.UserCreateInput,
  ): Promise<{ token: string; user: User }> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists)
      throw new BadRequestException({ message: 'User already Exist.' });

    data.password = await hash(data.password, 12);

    const user = await this.prisma.user.create({ data }).catch((er) => {
      return er;
    });

    const dataObj = this.createSendToken(user);
    return dataObj;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: User; token: string }> {
    const { email, password } = loginUserDto;

    // check if account dosent exist
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(password, user.password)))
      throw new UnauthorizedException({
        message: 'Incorrect email or password.',
      });

    // 2) Check if user exists && password is correct

    const token = this.signToken(user.id);

    // Remove password from output
    user.password = undefined;

    return { token, user };
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({});
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data }).catch((err) => err);
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } }).catch((er) => er);
  }
}
