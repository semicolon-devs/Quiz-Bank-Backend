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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AddSubCategoryDto } from './dto/add-subcategory.dto';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/utils/validation/parseObjectIDPipe';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { AddModuleDto } from './dto/add-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('/api/v1/subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('courses/:id')
  addSubCategory(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() addSubjectDto: AddSubCategoryDto,
  ) {
    return this.subjectsService.addSubCategory(id, addSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('module/:id')
  addModule(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() addModuleDto: AddModuleDto,
  ) {
    return this.subjectsService.addModule(id, addModuleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('cources')
  findAllCources() {
    return this.subjectsService.findAllCources();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.subjectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch('courses/:id')
  updateSubCategory(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subjectsService.updateSubCategory(id, updateSubCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch('module/:id')
  updateModule(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateModeluDto: UpdateModuleDto,
  ) {
    return this.subjectsService.updateModule(id, updateModeluDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.subjectsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete('courses/:id/:course_id')
  removeSubCategory(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Param('course_id', ParseObjectIdPipe) course_id: ObjectId,
  ) {
    return this.subjectsService.removeSubCategory(id, course_id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete('module/:course_id/:module_id')
  removeModule(
    @Param('course_id', ParseObjectIdPipe) course_id: ObjectId,
    @Param('module_id', ParseObjectIdPipe) module_id: ObjectId,
  ) {
    return this.subjectsService.removeModule(course_id, module_id);
  }
}
