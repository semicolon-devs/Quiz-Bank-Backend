import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './schemas/paper.schema';
import { Model, ObjectId, Schema } from 'mongoose';
import { PaperInterface } from './interfaces/createPaper.interface';
import { CreatePaperDto } from './dto/create-paper.dto';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { Question } from 'src/questions/schemas/question.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { UpdatePaper } from './dto/update-paper.dto';

@Injectable()
export class PapersService {
  constructor(
    @InjectModel(Paper.name) private readonly paperModel: Model<Paper>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private readonly questionService: QuestionsService,
  ) {}

  create(createPaperDto: CreatePaperDto) {
    const paper: PaperInterface = {
      paperId: createPaperDto.paperId,
      name: createPaperDto.name,
      timeInMinutes: createPaperDto.timeInMinutes,
      isTimed: createPaperDto.isTimed,
      paperType: createPaperDto.paperType,
    };

    return this.paperModel.create(paper);
  }

  async addQuestion(paper_id: ObjectId, reqDto: AddQuestionsDto) {
    try {
      const result = await this.paperModel.findById(paper_id);
      let questionIds: Set<string> = new Set(result.questions);

      reqDto.questionIdArray.forEach((id) => {
        questionIds.add(id);
      });

      return await this.paperModel.findByIdAndUpdate(
        paper_id,
        { $addToSet: { questions: Array.from(questionIds) } },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  // TODO: change according to requirement
  findAll() {
    return this.paperModel.find({}).populate({
      path: 'questions',
      select: 'question module subCategory subject type difficulty',
      populate: [
        {
          path: 'module',
          select: 'name -_id',
        },
        {
          path: 'subject',
          select: 'name -_id',
        },
        {
          path: 'subCategory',
          select: 'name -_id',
        },
      ],
    });
  }

  findAllAdmin() {
    return this.paperModel.find({}).populate({
      path: 'questions',
      select: 'question module subCategory subject type difficulty',
      populate: [
        {
          path: 'module',
          select: 'name -_id',
        },
        {
          path: 'subject',
          select: 'name -_id',
        },
        {
          path: 'subCategory',
          select: 'name -_id',
        },
      ],
    });
  }

  findOneAdmin(id: ObjectId) {
    return this.paperModel.findById(id).populate({
      path: 'questions',
      select: 'question module subCategory subject type difficulty',
      populate: [
        {
          path: 'module',
          select: 'name -_id',
        },
        {
          path: 'subject',
          select: 'name -_id',
        },
        {
          path: 'subCategory',
          select: 'name -_id',
        },
      ],
    });
  }

  findOne(id: ObjectId) {
    return this.paperModel.findById(id).select('-questions');
  }

  findOneInfo(id: ObjectId) {
    return this.paperModel.findById(id).select('name paperId -_id');
  }

  async findQuestion(paperId: ObjectId, question_index: number) {
    try {
      const questions = await this.paperModel
        .findById(paperId)
        .select('questions -_id');
      const questionIds: Array<string> = Array.from(questions.questions);
      return this.questionModel
        .findById(questionIds.at(question_index - 1))
        .select(
          '-subject -subCategory -module -difficulty -correctAnswer -explaination -_id',
        );
    } catch (err) {
      throw err;
    }
  }

  async findAnswer(paperId: ObjectId, question_index: number) {
    try {
      const questions = await this.paperModel
        .findById(paperId)
        .select('questions -_id');
      const questionIds: Array<string> = Array.from(questions.questions);
      return this.questionModel
        .findById(questionIds.at(question_index - 1))
        .select('correctAnswer explaination -_id');
    } catch (err) {
      throw err;
    }
  }

  async removeQuestion(paperId: ObjectId, question_index: number) {
    try {
      const questions = await this.paperModel
        .findById(paperId)
        .select('questions -_id');
      const questionIdArray: Set<string> = new Set(questions.questions);

      questionIdArray.delete(
        Array.from(questionIdArray).at(question_index - 1),
      );
      return await this.paperModel.findByIdAndUpdate(
        paperId,
        { questions: Array.from(questionIdArray) },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  removePaper(paperId: Schema.Types.ObjectId) {
    return this.paperModel.findByIdAndRemove(paperId);
  }

  updatePaper(paperId: Schema.Types.ObjectId, payload: UpdatePaper) {
    return this.paperModel.findByIdAndUpdate(paperId, payload);
  }
}
