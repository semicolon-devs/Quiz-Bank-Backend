import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './schemas/paper.schema';
import { Model, ObjectId, Schema } from 'mongoose';
import { PaperInterface } from './interfaces/createPaper.interface';
import { CreatePaperDto } from './dto/create-paper.dto';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { Question } from 'src/questions/schemas/question.schema';
import { UpdatePaper } from './dto/update-paper.dto';
import { GetAnswerRequestDto } from 'src/answers/dto/submit-answers.dto';
import { AnswersService } from 'src/answers/answers.service';
import { UpdateQuestionListDto } from './dto/update-questionlist.dto';
import { Filter } from './interfaces/paper-filter.interface';

@Injectable()
export class PapersService {
  constructor(
    @InjectModel(Paper.name) private readonly paperModel: Model<Paper>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @Inject(forwardRef(() => AnswersService))
    private readonly answersSerivce: AnswersService,
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
      const questionIds: Set<string> = new Set(result.questions);

      reqDto.questionIdArray.forEach((id) => {
        // check if given id already exists
        for (let i = 0; i < result.questions.length; i++) {
          if (result.questions[i] == id) {
            throw new HttpException(
              `Duplicate id, ${id} already exists in question list`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
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

  async updateQuestionList(paper_id: ObjectId, payload: UpdateQuestionListDto) {
    try {
      const questionList = payload.questionIdArray;
      return await this.paperModel.findByIdAndUpdate(
        paper_id,
        {
          questions: Array.from(questionList),
        },
        { new: true },
      );
    } catch (err) {
      console.log('Error in updating Question List', err);
      throw new HttpException(
        'Error in updating Question List',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: change according to requirement
  async findAll(filter: Filter) {
    filter.name ? (filter.name = filter.name) : (filter.name = '');
    filter.paperId ? (filter.paperId = filter.paperId) : (filter.paperId = '');

    const result = await this.paperModel
      .find({
        name: { $regex: filter.name, $options: 'i' },
        paperId: { $regex: filter.paperId, $options: 'i' },
        isArchived: false,
      })
      .skip((filter.page - 1) * filter.limit)
      .limit(filter.limit)
      .select('-isArchived')
      .populate({
        path: 'questions',
        select: 'question module subCategory subject type difficulty answers',
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

    const count = await this.paperModel
      .find({
        name: { $regex: filter.name, $options: 'i' },
        paperId: { $regex: filter.paperId, $options: 'i' },
      })
      .count();

    const pagination = {
      totalPapers: count,
      limit: filter.limit * 1,
      totalpages: Math.ceil(count / filter.limit),
      page: filter.page * 1,
    };
    return { result, pagination };
  }

  async findAllAdmin(filter: Filter) {
    filter.name ? (filter.name = filter.name) : (filter.name = '');
    filter.paperId ? (filter.paperId = filter.paperId) : (filter.paperId = '');

    const result = await this.paperModel
      .find({
        name: { $regex: filter.name, $options: 'i' },
        paperId: { $regex: filter.paperId, $options: 'i' },
        isArchived: false,
      })
      .skip((filter.page - 1) * filter.limit)
      .limit(filter.limit)
      .select('-isArchived')
      .populate({
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

    const count = await this.paperModel
      .find({
        name: { $regex: filter.name, $options: 'i' },
        paperId: { $regex: filter.paperId, $options: 'i' },
      })
      .count();

    const pagination = {
      totalPapers: count,
      limit: filter.limit * 1,
      totalpages: Math.ceil(count / filter.limit),
      page: filter.page * 1,
    };
    return { result, pagination };
  }

  async findAllArchived(filter: Filter) {
    filter.name ? (filter.name = filter.name) : (filter.name = '');
    filter.paperId ? (filter.paperId = filter.paperId) : (filter.paperId = '');

    const result = await this.paperModel
      .find({
        name: { $regex: filter.name, $options: 'i' },
        paperId: { $regex: filter.paperId, $options: 'i' },
        isArchived: true,
      })
      .skip((filter.page - 1) * filter.limit)
      .limit(filter.limit)
      .select('-isArchived')
      .populate({
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

    const count = await this.paperModel
      .find({
        name: { $regex: filter.name, $options: 'i' },
        paperId: { $regex: filter.paperId, $options: 'i' },
      })
      .count();

    const pagination = {
      totalPapers: count,
      limit: filter.limit * 1,
      totalpages: Math.ceil(count / filter.limit),
      page: filter.page * 1,
    };
    return { result, pagination };
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

  findOne(id: ObjectId | string) {
    return this.paperModel.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          _id: 1, // Include necessary fields
          paperId: 1,
          name: 1,
          timeInMinutes: 1,
          isTimed: 1,
          paperType: 1,
          questionsCount: { $size: '$questions' },
        },
      },
      { $limit: 1 }, // Ensure only one document is returned
    ]);
  }

  findOneInfo(id: ObjectId) {
    return this.paperModel.findById(id).select('name paperId -_id');
  }

  async findQuestion(
    paperId: ObjectId | string,
    question_index: number,
    userId: string,
  ) {
    try {
      const questions = await this.paperModel
        .findById(paperId)
        .select('questions -_id');
      const questionIds: Array<string> = Array.from(questions.questions);
      const question = await this.questionModel
        .findById(questionIds.at(question_index - 1))
        .select(
          '-subject -subCategory -module -difficulty -correctAnswer -explaination -_id',
        );

      if (question == null) {
        throw new HttpException(
          'No Question found for given index',
          HttpStatus.BAD_REQUEST,
        );
      }

      const getAnswerRequestDto: GetAnswerRequestDto = {
        paperId: paperId,
        questionIndex: question_index,
        userId: userId,
      };

      const answer = await this.answersSerivce.getAnswer(getAnswerRequestDto);

      const returnObj = {
        question,
      };

      if (answer != undefined) {
        returnObj['answer'] = { number: answer.number, answer: answer.answer };
      }
      return returnObj;
    } catch (err) {
      throw err;
    }
  }

  async findAnswer(paperId: ObjectId | string, question_index: number) {
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

  async removeQuestion(paperId: ObjectId, question_id: ObjectId) {
    try {
      const questions = await this.paperModel
        .findById(paperId)
        .select('questions -_id');
      const questionIdArray: Set<string> = new Set(questions.questions);

      let isRemoved: boolean = false;

      questionIdArray.forEach((question) => {
        if (question == question_id.toString()) {
          questionIdArray.delete(question);
          isRemoved = true;
        }
      });

      if (!isRemoved) {
        throw new HttpException(
          'given id not  found in the question ids array',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return await this.paperModel.findByIdAndUpdate(
          paperId,
          { questions: Array.from(questionIdArray) },
          { new: true },
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async removePaper(paperId: Schema.Types.ObjectId) {
    const papername = await this.paperModel
      .findById(paperId)
      .select('name -_id');
    console.log(papername);

    return await this.paperModel.findByIdAndUpdate(
      paperId,
      { isArchived: true, name: papername.name + '-archived' },
      { new: true },
    );
  }

  updatePaper(paperId: Schema.Types.ObjectId, payload: UpdatePaper) {
    return this.paperModel.findByIdAndUpdate(paperId, payload);
  }

  async getNumberOfQuestions(paperId: string) {
    const paper: Paper = await this.paperModel.findById(paperId);
    return paper.questions.length;
  }
}
