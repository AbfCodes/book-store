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
import { Roles } from 'src/decorators/user.decorator';
import { RolesGuard } from 'src/guards/roles-guard.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('/api/v1/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto as any);
  }

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async findAll() {
    return this.booksService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto as any);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
