import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [UsersModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
})
export class BooksModule {}
