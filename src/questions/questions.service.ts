import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schemas/question.schema';
import {
  AnswerInterface,
  QuestionInterface,
  UpdateQuestionInterface,
} from './interfaces/question.interface';
import { Aggregate, Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Filter } from './interfaces/filter.interface';
import { Pagination } from './interfaces/pagination.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const answersArray: AnswerInterface[] = [];

    createQuestionDto.answers.forEach(async (item) => {
      const answer: AnswerInterface = {
        number: item.number,
        answer: item.answer,
      };

      answersArray.push(answer);
    });
    const question: QuestionInterface = {
      subject: createQuestionDto.subject,
      subCategory: createQuestionDto.subCategory,
      module: createQuestionDto.module,
      type: createQuestionDto.type,
      question: createQuestionDto.question,
      answers: answersArray,
      difficulty: createQuestionDto.difficulty,
      correctAnswer: createQuestionDto.correctAnswer,
      explaination: createQuestionDto.explaination,
    };

    const createdQuestion = this.questionModel.create(question);
    return createdQuestion;
  }

  async findAll(queryParams: Pagination): Promise<Question[]> {
    return await this.questionModel
      .find({})
      .limit(queryParams.limit)
      .skip(queryParams.limit * queryParams.page)
      .select('difficulty type question subject subCategory module')
      .populate('subject', 'name -_id')
      .populate('subCategory', 'name -_id')
      .populate('module', 'name -_id');
  }

  async filter(allQueryParams: Filter) {
    let result: any;
    let numberOfQuestions: number;

    // if allQueryParams ahs filter args 
    //    filter database with mongoose agrigation
    // else 
    //    use find limit and skip

    if (
      allQueryParams.subject ||
      allQueryParams.subCategory ||
      allQueryParams.module
    ) {

      // two pipelines used to get result docs and total number of questions
      // TODO: modify this block with a better method. this get the work done but may not be the best method

      const pipeline1 = [
        {
          $lookup: {
            from: 'subjects',
            localField: 'subject',
            foreignField: '_id',
            as: 'subject',
          },
        },
        {
          $unwind: '$subject',
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategory',
          },
        },
        {
          $unwind: '$subCategory',
        },
        {
          $lookup: {
            from: 'modules',
            localField: 'module',
            foreignField: '_id',
            as: 'module',
          },
        },
        {
          $unwind: '$module',
        },
        {
          $match: {
            $or: [
              { 'subject.name': allQueryParams.subject },
              { 'subCategory.name': allQueryParams.subCategory },
              { 'module.name': allQueryParams.module },
            ],
          },
        },
        {
          $count: 'totalCount',
        },
        {
          $project: {
            totalCount: 1, // Keep the count field

          },
        },
      ];

      const pipeline2 = [
        {
          $lookup: {
            from: 'subjects',
            localField: 'subject',
            foreignField: '_id',
            as: 'subject',
            pipeline: [
              { $project: { name: 1, _id: 0 } }, // Project only name
            ],
          },
        },
        {
          $unwind: '$subject',
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategory',
            pipeline: [
              { $project: { name: 1, _id: 0 } }, // Project only name
            ],
          },
        },
        {
          $unwind: '$subCategory',
        },
        {
          $lookup: {
            from: 'modules',
            localField: 'module',
            foreignField: '_id',
            as: 'module',
            pipeline: [
              { $project: { name: 1, _id: 0 } }, // Project only name
            ],
          },
        },
        {
          $unwind: '$module',
        },
        {
          $project: {
            // Include only desired fields from the original document
            _id: 1, // Keep _id if needed, otherwise remove
            answers: 0,
            correctAnswer: 0,
            explaination: 0,
            // ... other desired fields from your document
            // subject: '$subject',
            // subCategory: '$subCategory',
            // module: '$module',
          }
        },
        {
          $match: {
            $or: [
              { 'subject.name': allQueryParams.subject },
              { 'subCategory.name': allQueryParams.subCategory },
              { 'module.name': allQueryParams.module },
            ],
          },
        },
        {
          $skip: allQueryParams.limit * (allQueryParams.page - 1),
        },
        {
          $limit: allQueryParams.limit * 1,
        },
      ];

      const result2 = await this.questionModel.aggregate(pipeline1);
      result = await this.questionModel.aggregate(pipeline2);
      numberOfQuestions = result2[0].totalCount;

    } else {
      numberOfQuestions = await this.questionModel.countDocuments();
      result = await this.questionModel
        .find()
        .skip(allQueryParams.limit * (allQueryParams.page - 1))
        .limit(allQueryParams.limit);
    }
    const pagination = {
      totalQuestions : numberOfQuestions,
      page: allQueryParams.page * 1,
      limit: allQueryParams.limit * 1
    }
    return { result, pagination };
  }

  async findOne(id: ObjectId): Promise<Question> {
    return await this.questionModel
      .findById(id)
      .populate('subject')
      .populate('subCategory')
      .populate('module');
  }

  update(id: ObjectId, updateQuestionDto: UpdateQuestionDto) {
    const newQuestion: UpdateQuestionInterface = {};
    if (updateQuestionDto.subject) {
      newQuestion['subject'] = updateQuestionDto.subject;
    }
    if (updateQuestionDto.subCategory) {
      newQuestion['subCategory'] = updateQuestionDto.subCategory;
    }
    if (updateQuestionDto.question) {
      newQuestion['question'] = updateQuestionDto.question;
    }
    if (updateQuestionDto.answers) {
      newQuestion['answers'] = updateQuestionDto.answers;
    }
    if (updateQuestionDto.difficulty) {
      newQuestion['difficulty'] = updateQuestionDto.difficulty;
    }
    if (updateQuestionDto.correctAnswer) {
      newQuestion['correctAnswer'] = updateQuestionDto.correctAnswer;
    }
    if (updateQuestionDto.explaination) {
      newQuestion['explaination'] = updateQuestionDto.explaination;
    }

    return this.questionModel.findByIdAndUpdate(id, newQuestion, { new: true });
  }

  async remove(id: ObjectId): Promise<string> {
    const result = await this.questionModel.findByIdAndDelete(id);
    return result ? 'deleted' : 'error deleting';
  }
}
