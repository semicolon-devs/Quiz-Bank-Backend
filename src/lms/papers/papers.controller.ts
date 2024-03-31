import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { JwtAuthGuard as JwtAuthGuardQBank } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/utils/validation/parseObjectIDPipe';

@Controller()
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  @UseGuards(JwtAuthGuardQBank, JwtAuthGuard)
  @Get()
  findAll() {
    return this.papersService.findAll();
  }

  @UseGuards(JwtAuthGuardQBank, JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.papersService.findOne(id);
  }

  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updatePaperDto: UpdatePaperDto,
  ) {
    return this.papersService.update(id, updatePaperDto);
  }

  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.papersService.remove(id);
  }
}
