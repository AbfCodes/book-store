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
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('/api/v1/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  findAll() {
    return this.tagsService.findAll();
  }

  @Get('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('ADMIN', 'USER')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
