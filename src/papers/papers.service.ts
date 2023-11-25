import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './schemas/paper.schema';
import { Model } from 'mongoose';
import { CreatePaperInterface } from './interfaces/createPaper.interface';
import { CreatePaperDto } from './dto/create-paper.dto';

@Injectable()
export class PapersService {
  constructor(
    @InjectModel(Paper.name) private readonly paperModel: Model<Paper>,
  ) {}

  create(createPaperDto: CreatePaperDto) {
    const paper: CreatePaperInterface = {
      paperId: createPaperDto.paperId,
      timeInMinutes: createPaperDto.timeInMinutes,
      paperType: createPaperDto.paperType,
    };

    return this.paperModel.create(paper);
  }
}
