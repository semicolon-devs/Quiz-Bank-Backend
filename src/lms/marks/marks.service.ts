import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Marks } from './schemas/marks.schema';
import { Marks as IMarks } from './interfaces/marks.interface';
import { Model, ObjectId } from 'mongoose';
import { AddmarksDto } from './dto/add-marks.dto';
import { UpdateMarksDto } from './dto/update-marks.dto';
import { after } from 'node:test';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Marks.name, 'lms') private readonly MarksModel: Model<Marks>,
  ) {}

  async getMarks(userId: ObjectId) {
    return this.MarksModel.find({ userId: userId });
  }

  // TODO: complete find all filter
  async findAll() {
    const userIds = await this.MarksModel.find({})
      .select('userId -_id')
      .distinct('userId');

    const structuredDataSet: Set<IMarks[]> = new Set();
    userIds.forEach(async (userId) => {
      const data = await this.MarksModel.find({ userId: userId.userId });
      console.log(userId);

      structuredDataSet.add(
        await this.MarksModel.find({ userId: userId.userId }),
      );
    });
    console.log(structuredDataSet);
  }

  async addMarks(addMarksDto: AddmarksDto) {
    addMarksDto.marks.forEach(async (mark) => {
      const newMarks: IMarks = {
        paperId: mark.paperId,
        userId: addMarksDto.userId,
        marks: mark.marks,
      };

      await this.MarksModel.create(newMarks);
    });

    return this.MarksModel.find({ userId: addMarksDto.userId });
  }

  async updateMarks(
    userId: ObjectId,
    paperId: ObjectId,
    updateMarksDto: UpdateMarksDto,
  ) {
    const filter = { userId: userId, paperId: paperId };
    return await this.MarksModel.updateMany(filter, updateMarksDto, {
      new: true,
    });
  }

  async deleteMark(userId: ObjectId, paperId: ObjectId) {
    const filter = { userId: userId, paperId: paperId };
    return this.MarksModel.deleteMany(filter);
  }
}
