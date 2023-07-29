import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: User,
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: Order }> {
    let totalPoints = 0;

    const books = await this.prisma.book.findMany({
      where: { id: { in: createOrderDto.items.map((el) => el.book) } },
    });

    const items = books.map((book) => {
      let bookQuant = createOrderDto.items.find((el) => el.book === book.id);
      totalPoints += bookQuant.quantity * book.points;
      return {
        bookId: book.id,
        quantity: bookQuant.quantity,
        points: bookQuant.quantity * book.points,
      };
    });

    if (user.points < totalPoints)
      throw new BadRequestException('sorry, not enough points to purchase');

    const createdOrder = await this.prisma.order.create({
      data: {
        totalPoints,
        status: 'PENDING',
        userId: user.id,
        items: { createMany: { data: items } },
      },
      include: { items: { include: { book: true } } },
    });

    // deducting points
    await this.prisma.user.update({
      where: { id: user.id },
      data: { points: user.points - totalPoints },
    });

    return { order: createdOrder };
  }

  async findAll(user: User): Promise<{ orders: Order[] }> {
    const orders = await this.prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { include: { book: true } } },
    });

    return { orders };
  }

  async findOne(id: string): Promise<{ order: Order }> {
    const order = await this.prisma.order
      .findUnique({
        where: { id },
        include: { items: { include: { book: true } } },
      })
      .catch((er) => er);

    return { order };
  }

  async update(user: User, id: string): Promise<{ order: Order }> {
    const isExists = await this.prisma.order.findUnique({
      where: { id, userId: user.id },
    });

    if (!isExists) throw new BadRequestException('Order not found');
    if (isExists.status != 'PENDING')
      throw new BadRequestException(
        'Order cannot be cancelled as it is not in pending state',
      );

    const order = await this.prisma.order.update({
      where: { id, userId: user.id },
      data: { status: 'CANCELLED' },
      include: { items: { include: { book: true } } },
    });

    // refunding points
    await this.prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: order.totalPoints } },
    });

    return { order };
  }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
