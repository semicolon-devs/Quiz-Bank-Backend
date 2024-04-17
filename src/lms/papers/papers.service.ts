import { Injectable } from '@nestjs/common';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './schemas/paper.schema';
import { Model, ObjectId } from 'mongoose';
import { Paper as IPaper } from './interfaces/paper.interface';

@Injectable()
export class PapersService {
  constructor(
    @InjectModel(Paper.name, 'lms') private readonly paperModel: Model<Paper>,
  ) {}

  create(createPaperDto: CreatePaperDto) {
    const paper: IPaper = {
      title: createPaperDto.title,
      fileId: createPaperDto.fileId,
    };
    return this.paperModel.create(paper);
  }

  findAll() {
    return this.paperModel.find({}).exec();
  }

  findOne(id: ObjectId) {
    return this.paperModel.findById(id).exec();
  }

  update(id: ObjectId, updatePaperDto: UpdatePaperDto) {
    return this.paperModel.findByIdAndUpdate(id, updatePaperDto, { new: true });
  }

  remove(id: ObjectId) {
    return this.paperModel.findByIdAndRemove(id);
  }

  removeAll() {
    return this.paperModel.deleteMany({});
  }
}
