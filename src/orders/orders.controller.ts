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
import { User } from '@prisma/client';
import { GetUser, Roles } from 'src/decorators/user.decorator';
import { RolesGuard } from 'src/guards/roles-guard.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('/api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('USER')
  async create(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
    console.log(user, createOrderDto);
    return this.ordersService.create(user, createOrderDto);
  }

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async findAll(@GetUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch('/cancel/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async update(@GetUser() user: User, @Param('id') id: string) {
    return this.ordersService.update(user, id);
  }
}
