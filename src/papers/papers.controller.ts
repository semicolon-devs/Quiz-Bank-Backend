import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { ParseObjectIdPipe } from 'src/utils/validation/parseObjectIDPipe';
import { ObjectId } from 'mongoose';
import { AddQuestionsDto } from './dto/add-questions.dto';

@Controller('api/v1/papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  @Post('add/:id')
  addQuestions(
    @Param('id', ParseObjectIdPipe) paper_id: ObjectId,
    @Body() addQuestionsDto: AddQuestionsDto,
  ) {
    return this.papersService.addQuestion(paper_id, addQuestionsDto);
  }

  @Get()
  findAll() {
    return this.papersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id:ObjectId) {
    return this.papersService.findOne(id);
  }

  @Get(':paper_id/:question_index')
  getQuestion(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index') question_index: number,
  ) {
    return this.papersService.findQuestion(paperId, question_index);
  }

  @Get('answer/:paper_id/:question_index')
  getAnswer(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index') question_index: number,
  ) {
    return this.papersService.findAnswer(paperId, question_index);
  }

  @Delete(':paper_id/:question_index')
  removeQuestion(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index') question_index: number,
  ) {
    return this.papersService.removeQuestion(paperId, question_index);
  }
}
