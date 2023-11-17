import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AddSubjectDto } from './dto/add-subject.dto';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from 'src/utils/validation/parseObjectIDPipe';

@Controller('/api/v1/subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Post('courses/:id')
  addSubCategory(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() addSubjectDto: AddSubjectDto,
  ) {
    return this.subjectsService.addSubCategory(id, addSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  
  @Get('cources')
  findAllCources() {
    return this.subjectsService.findAllCources();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.subjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  // TODO: delete route to delete sub category only; removing subject should assign all questions to other subject category
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.subjectsService.remove(id);
  }

    @Delete('/:id/:course_id')
    removeSubCategory(@Param('id', ParseObjectIdPipe) id: ObjectId, @Param('course_id', ParseObjectIdPipe) course_id: string) {
      return this.subjectsService.removeSubCategory(id, course_id);
    }
}
