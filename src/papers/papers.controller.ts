import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { ParseObjectIdPipe } from 'src/utils/validation/parseObjectIDPipe';
import { ObjectId } from 'mongoose';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/v1/papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('add/:id')
  addQuestions(
    @Param('id', ParseObjectIdPipe) paper_id: ObjectId,
    @Body() addQuestionsDto: AddQuestionsDto,
  ) {
    return this.papersService.addQuestion(paper_id, addQuestionsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get()
  findAll() {
    return this.papersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id:ObjectId) {
    return this.papersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get(':paper_id/:question_index')
  getQuestion(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index') question_index: number,
  ) {
    return this.papersService.findQuestion(paperId, question_index);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get('answer/:paper_id/:question_index')
  getAnswer(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index') question_index: number,
  ) {
    return this.papersService.findAnswer(paperId, question_index);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':paper_id/:question_index')
  removeQuestion(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index') question_index: number,
  ) {
    return this.papersService.removeQuestion(paperId, question_index);
  }
}
