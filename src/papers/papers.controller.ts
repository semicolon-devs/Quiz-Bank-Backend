import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { getCurrentUserId } from 'src/auth/decorator/user-id.decorator';
import { UpdateQuestionListDto } from './dto/update-questionlist.dto';
import { Filter } from './interfaces/paper-filter.interface';

@Controller('api/v1/papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  // to create a new paper (empty question array)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  // to add questions
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('add/:id')
  addQuestions(
    @Param('id', ParseObjectIdPipe) paper_id: ObjectId,
    @Body() addQuestionsDto: AddQuestionsDto,
  ) {
    return this.papersService.addQuestion(paper_id, addQuestionsDto);
  }

  // to update question array entirely. (for set the order of questions)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch('update-questions/:id')
  updateQuestionsList(
    @Param('id', ParseObjectIdPipe) paper_id: ObjectId,
    @Body() updateQuestionsDto: UpdateQuestionListDto,
  ) {
    return this.papersService.updateQuestionList(paper_id, updateQuestionsDto);
  }

  // to get list available papers to users
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get()
  findAll(@Query() filter: Filter) {
    return this.papersService.findAll(filter);
  }

  // to list already added questions in add question page
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('/admin')
  findAllAdmin(@Query() filter: Filter) {
    return this.papersService.findAllAdmin(filter);
  }

  // get all archived papers
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('/archived')
  findAllArchived(@Query() filter: Filter) {
    return this.papersService.findAllArchived(filter);
  }

  // get one paper (for admin)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('admin/:id')
  findOneAdmin(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.papersService.findOneAdmin(id);
  }

  // get one paper (for user -> without correct answer and explaination)
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

  // get full question by question number and paper ( for show to user)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get(':paper_id/:question_index')
  getQuestion(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index', ParseIntPipe) question_index: number,
    @getCurrentUserId() userId: string,
  ) {
    return this.papersService.findQuestion(paperId, question_index, userId);
  }

  // get the correct answer of a question
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Get('answer/:paper_id/:question_index')
  getAnswer(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_index', ParseIntPipe) question_index: number,
  ) {
    return this.papersService.findAnswer(paperId, question_index);
  }

  // to remove question from a paper
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':paper_id/:question_id')
  removeQuestion(
    @Param('paper_id', ParseObjectIdPipe) paperId: ObjectId,
    @Param('question_id', ParseObjectIdPipe) question_id: ObjectId,
  ) {
    return this.papersService.removeQuestion(paperId, question_id);
  }

  // to remove entire paper
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':paper_id')
  removePaper(@Param('paper_id', ParseObjectIdPipe) paperId: ObjectId) {
    return this.papersService.removePaper(paperId);
  }

  // to update paper details. not question list
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
