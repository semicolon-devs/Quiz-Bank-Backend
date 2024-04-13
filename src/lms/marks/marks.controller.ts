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
import { MarksService } from './marks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AddmarksDto } from './dto/add-marks.dto';
import { ParseObjectIdPipe } from 'src/common/utils/validation/parseObjectIDPipe';
import { ObjectId } from 'mongoose';
import { UpdateMarksDto } from './dto/update-marks.dto';

@Controller()
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() data: AddmarksDto) {
    return await this.marksService.addMarks(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMarks(@Param('id', ParseObjectIdPipe) userId: ObjectId) {
    return await this.marksService.getMarks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllMarks() {
    return await this.marksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Patch(':userId/:paperId')
  async updateMarks(
    @Param('userId', ParseObjectIdPipe) userId: ObjectId,
    @Param('paperId', ParseObjectIdPipe) paperId: ObjectId,
    @Body() newData: UpdateMarksDto,
  ) {
    return await this.marksService.updateMarks(userId, paperId, newData);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':userId/:paperId')
  async deleteMarks(
    @Param('userId', ParseObjectIdPipe) userId: ObjectId,
    @Param('paperId', ParseObjectIdPipe) paperId: ObjectId,
  ) {
    return await this.marksService.deleteMark(userId, paperId);
  }
}
