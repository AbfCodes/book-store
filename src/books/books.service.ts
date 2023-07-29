import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto): Promise<{ book: Book }> {
    const data = createBookDto as unknown as Prisma.BookCreateInput;

    // Create the book record
    const book = await this.prisma.book.create({
      data: {
        ...data,
        tags: { connect: createBookDto.tags?.map((tagId) => ({ id: tagId })) },
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tags: true,
      },
    });

    // // Associate the tags with the book
    // await this.prisma.book.update({
    //   where: { id: book.id },
    //   data: {
    //     tags: {
    //       connect: tagIds.map((tagId) => ({ id: tagId })),
    //     },
    //   },
    // });

    return { book };
  }

  async findAll(): Promise<{ books: Book[] }> {
    const books = await this.prisma.book
      .findMany({
        include: {
          author: { select: { firstName: true, lastName: true, email: true } },
          tags: true,
        },
      })
      .catch((er) => er);

    return { books };
  }

  async findOne(id: string): Promise<{ book: Book }> {
    const book = await this.prisma.book
      .findUnique({
        where: { id },
        include: {
          author: { select: { firstName: true, lastName: true, email: true } },
          tags: true,
        },
      })
      .catch((er) => er);

    return { book };
  }

  async update(
    id: string,
    data: Prisma.BookUpdateInput,
  ): Promise<{ book: Book }> {
    const book = await this.prisma.book
      .update({
        where: { id },
        data,
        include: {
          author: { select: { firstName: true, lastName: true, email: true } },
          tags: true,
        },
      })
      .catch((err) => err);

    return { book };
  }

  async remove(id: string): Promise<{ book: Book }> {
    const book = await this.prisma.book
      .delete({ where: { id } })
      .catch((er) => er);

    return { book };
  }
}
