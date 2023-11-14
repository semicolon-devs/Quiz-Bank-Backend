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
  
  @Controller('/api/v1/subjects')
  export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) {}
  
    @Post()
    create(@Body() createSubjectDto: CreateSubjectDto) {
      return this.subjectsService.create(createSubjectDto);
    }

    @Post("courses/:id")
    addSubCategory(@Param('id') id:string, @Body() addSubjectDto: AddSubjectDto) {
      return this.subjectsService.addSubCategory(id, addSubjectDto);
    }
  
    @Get()
    findAll() {
      return this.subjectsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.subjectsService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
      return this.subjectsService.update(+id, updateSubjectDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.subjectsService.remove(+id);
    }
  }
  