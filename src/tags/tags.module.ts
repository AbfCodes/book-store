import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [UsersModule],
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
