import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Marks } from './schemas/marks.schema';
import { Marks as IMarks } from './interfaces/marks.interface';
import { Model, ObjectId, Schema } from 'mongoose';
import { AddmarksDto } from './dto/add-marks.dto';
import { UpdateMarksDto } from './dto/update-marks.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Marks.name, 'lms') private readonly MarksModel: Model<Marks>,
  ) {}

  async getMarks(userId: ObjectId) {
    return this.MarksModel.find({ userId: userId });
  }

  findByUserAndPaperId(
    userId: Schema.Types.ObjectId,
    paperId: Schema.Types.ObjectId,
  ) {
    return this.MarksModel.find({ userId: userId, paperId: paperId });
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
    const newMarks: IMarks = {
      paperId: addMarksDto.paperId,
      userId: addMarksDto.userId,
      reading: addMarksDto.reading,
      logicalAndProblemSolving: addMarksDto.logicalAndProblemSolving,
      biology: addMarksDto.biology,
      chemistry: addMarksDto.chemistry,
      physicsAndMaths: addMarksDto.physicsAndMaths,
      didNotAnswer: addMarksDto.didNotAnswer,
      wrongAnswer: addMarksDto.wrongAnswer,
      corrcetAnswer: addMarksDto.corrcetAnswer,
      lostmarks: addMarksDto.lostmarks,
      total: addMarksDto.total,
    };

    return await this.MarksModel.create(newMarks);
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
