import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './schemas/paper.schema';
import { Model, ObjectId } from 'mongoose';
import { CreatePaperInterface } from './interfaces/createPaper.interface';
import { CreatePaperDto } from './dto/create-paper.dto';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { Question } from 'src/questions/schemas/question.schema';
import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class PapersService {
  constructor(
    @InjectModel(Paper.name) private readonly paperModel: Model<Paper>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private readonly questionService: QuestionsService,
  ) {}

  create(createPaperDto: CreatePaperDto) {
    const paper: CreatePaperInterface = {
      paperId: createPaperDto.paperId,
      timeInMinutes: createPaperDto.timeInMinutes,
      paperType: createPaperDto.paperType,
    };

    return this.paperModel.create(paper);
  }

  addQuestion(paper_id: ObjectId, reqDto: AddQuestionsDto) {
    this.paperModel
      .findById(paper_id)
      .then((result) => {
        const questionIds: Set<string> = new Set(result.questions);

        reqDto.questionIdArray.forEach((id) => {
          questionIds.add(id);
        });

        return this.paperModel.findByIdAndUpdate(
          paper_id,
          { questions: Array.from(questionIds) },
          { new: true },
        );
      })
      .catch((err) => {
        throw err;
      });
  }

  findAll() {
    return this.paperModel.find({});
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
        .select(
          'correctAnswer explaination -_id',
        );
    } catch (err) {
      throw err;
    }
  }
}
