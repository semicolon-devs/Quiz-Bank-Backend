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
    @InjectModel(Question.name, 'quizbank') private readonly questionModel: Model<Question>,
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
      .find({ isArchived: false })
      .limit(queryParams.limit)
      .skip(queryParams.limit * queryParams.page)
      .select('difficulty type question subject subCategory module')
      .populate('subject', 'name -_id')
      .populate('subCategory', 'name -_id')
      .populate('module', 'name -_id');
  }

  async findAllArchived(allQueryParams: Filter) {
    allQueryParams.search
      ? (allQueryParams.search = allQueryParams.search)
      : (allQueryParams.search = '');
    allQueryParams.subject
      ? (allQueryParams.subject = allQueryParams.subject)
      : (allQueryParams.subject = '');
    allQueryParams.subCategory
      ? (allQueryParams.subCategory = allQueryParams.subCategory)
      : (allQueryParams.subCategory = '');
    allQueryParams.module
      ? (allQueryParams.module = allQueryParams.module)
      : (allQueryParams.module = '');

    // two pipelines used to get result docs and total number of questions
    // TODO: modify this block with a better method. this get the work done but may not be the best method

    // to get the count of filterd docs
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
          $and: [
            {
              'subject.name': {
                $regex: allQueryParams.subject,
                $options: 'i',
              },
            },
            {
              'subCategory.name': {
                $regex: allQueryParams.subCategory,
                $options: 'i',
              },
            },
            {
              'module.name': { $regex: allQueryParams.module, $options: 'i' },
            },
            { question: { $regex: allQueryParams.search, $options: 'i' } },
            { isArchived: true },
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

    // to get the filterd docs
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
          _id: 1,
          answers: 0,
          correctAnswer: 0,
          explaination: 0,
        },
      },
      {
        $match: {
          $and: [
            {
              'subject.name': {
                $regex: allQueryParams.subject,
                $options: 'i',
              },
            },
            {
              'subCategory.name': {
                $regex: allQueryParams.subCategory,
                $options: 'i',
              },
            },
            {
              'module.name': { $regex: allQueryParams.module, $options: 'i' },
            },
            { question: { $regex: allQueryParams.search, $options: 'i' } },
            { isArchived: true },
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

    const count = await this.questionModel.aggregate(pipeline1);
    const result = await this.questionModel.aggregate(pipeline2);

    const numberOfQuestions = count.length > 0 ? count[0].totalCount : 0;

    // details for pagination
    const pagination = {
      totalQuestions: numberOfQuestions,
      limit: allQueryParams.limit * 1,
      page: allQueryParams.page * 1,
      totalPages: Math.ceil(numberOfQuestions / allQueryParams.limit),
    };
    return { result, pagination };
  }

  async filter(allQueryParams: Filter) {
    // let result: any;
    // let numberOfQuestions: number;

    allQueryParams.search
      ? (allQueryParams.search = allQueryParams.search)
      : (allQueryParams.search = '');
    allQueryParams.subject
      ? (allQueryParams.subject = allQueryParams.subject)
      : (allQueryParams.subject = '');
    allQueryParams.subCategory
      ? (allQueryParams.subCategory = allQueryParams.subCategory)
      : (allQueryParams.subCategory = '');
    allQueryParams.module
      ? (allQueryParams.module = allQueryParams.module)
      : (allQueryParams.module = '');

    // two pipelines used to get result docs and total number of questions
    // TODO: modify this block with a better method. this get the work done but may not be the best method

    // to get the count of filterd docs
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
          $and: [
            {
              'subject.name': {
                $regex: allQueryParams.subject,
                $options: 'i',
              },
            },
            {
              'subCategory.name': {
                $regex: allQueryParams.subCategory,
                $options: 'i',
              },
            },
            {
              'module.name': { $regex: allQueryParams.module, $options: 'i' },
            },
            { question: { $regex: allQueryParams.search, $options: 'i' } },
            { isArchived: false },
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

    // to get the filterd docs
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
          _id: 1,
          answers: 0,
          correctAnswer: 0,
          explaination: 0,
        },
      },
      {
        $match: {
          $and: [
            {
              'subject.name': {
                $regex: allQueryParams.subject,
                $options: 'i',
              },
            },
            {
              'subCategory.name': {
                $regex: allQueryParams.subCategory,
                $options: 'i',
              },
            },
            {
              'module.name': { $regex: allQueryParams.module, $options: 'i' },
            },
            { question: { $regex: allQueryParams.search, $options: 'i' } },
            { isArchived: false },
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

    const count = await this.questionModel.aggregate(pipeline1);
    const result = await this.questionModel.aggregate(pipeline2);

    const numberOfQuestions = count.length > 0 ? count[0].totalCount : 0;

    // details for pagination
    const pagination = {
      totalQuestions: numberOfQuestions,
      limit: allQueryParams.limit * 1,
      page: allQueryParams.page * 1,
      totalPages: Math.ceil(numberOfQuestions / allQueryParams.limit),
    };
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
    return this.questionModel.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true },
    );
  }
}
