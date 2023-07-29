import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles-guard.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/user.decorator';

@Controller('/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.usersService.create(createUserDto as any);
      return { data };
    } catch (error) {
      return error.message;
    }
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const data = await this.usersService.login(loginUserDto);

    return { status: 'success', data };
  }

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async findAll() {
    try {
      const data = await this.usersService.findAll();

      return { data };
    } catch (error) {
      return error.message;
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);

    return { data };
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(
      id as any,
      updateUserDto as any,
    );

    return { data };
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
