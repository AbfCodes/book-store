import { Injectable } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TagCreateInput): Promise<{ tag: Tag }> {
    const tag = await this.prisma.tag.create({ data }).catch((er) => er);

    return { tag };
  }

  async findAll(): Promise<{ tags: Tag[] }> {
    const tags = await this.prisma.tag
      .findMany({ include: { books: true } })
      .catch((er) => er);

    return { tags };
  }

  async findOne(id: string): Promise<{ tag: Tag }> {
    const tag = await this.prisma.tag
      .findUnique({ where: { id }, include: { books: true } })
      .catch((er) => er);

    return { tag };
  }

  async update(id: string, data: Prisma.TagUpdateInput): Promise<{ tag: Tag }> {
    const tag = await this.prisma.tag
      .update({ where: { id }, data, include: { books: true } })
      .catch((err) => err);

    return { tag };
  }

  async remove(id: string): Promise<{ tag: Tag }> {
    const tag = await this.prisma.tag
      .delete({ where: { id } })
      .catch((er) => er);

    return { tag };
  }
}
