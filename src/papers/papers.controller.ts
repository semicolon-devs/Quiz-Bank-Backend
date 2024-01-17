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
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { ParseObjectIdPipe } from 'src/common/utils/validation/parseObjectIDPipe';
import { ObjectId } from 'mongoose';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePaper } from './dto/update-paper.dto';

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

  // to get list available papers to users
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get()
  findAll() {
    return this.papersService.findAll();
  }

  // to list already questions in add question page
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('/admin')
  findAllAdmin() {
    return this.papersService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('admin/:id')
  findOneAdmin(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.papersService.findOneAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.papersService.findOne(id);
  }

  // to get paper name and code
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get(':id/info')
  findPaperInfo(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.papersService.findOneInfo(id);
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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':paper_id')
  removePaper(@Param('paper_id', ParseObjectIdPipe) paperId: ObjectId) {
    return this.papersService.removePaper(paperId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':paper_id')
  updatePaper(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Body() payload: UpdatePaper,
  ) {
    return this.papersService.updatePaper(paperId, payload);
  }
}
