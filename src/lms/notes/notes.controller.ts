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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ParseObjectIdPipe } from 'src/common/utils/validation/parseObjectIDPipe';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.notesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.notesService.remove(id);
  }
}
