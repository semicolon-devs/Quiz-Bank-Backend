import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schemas/question.schema';
import {
  AnswerInterface,
  QuestionInterface,
  UpdateQuestionInterface,
} from './interfaces/question.interface';
import { Model, ObjectId } from 'mongoose';
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

  // async filter(allQueryParams: Filter) {


  //   const filter = {
  //     'subject.name': allQueryParams.subject,
  //   };

  //   // return this.questionModel
  //   //   .find(filter)
  //   //   .limit(allQueryParams.limit)
  //   //   .skip(allQueryParams.limit * allQueryParams.page)
  //   //   .populate('subject')
  //   //   .populate('subCategory')
  //   //   .populate('module');

  //     const pipeline = [
  //       {
  //         $match: {
  //           $or: [
  //             {"subject.name" : allQueryParams.subject},
  //             {"subCategory.name": allQueryParams.subCategory},
  //             {"module.name": allQueryParams.module}
  //           ]
  //         }
  //       },
  //       // ... other aggregation stages if needed
  //       {
  //         $limit: allQueryParams.limit
  //       },
  //       {
  //         $skip: allQueryParams.limit * (allQueryParams.page - 1)
  //       },
  //       // {
  //       //   $populate: [
  //       //     { path: 'subject' },
  //       //     { path: 'subCategory' },
  //       //     { path: 'module' }
  //       //   ]
  //       // }
  //     ];

  //     return this.questionModel.aggregate(pipeline);
  //   // return this.questionModel.aggregate([
  //   //   {
  //   //     $unwind: '$subject',
  //   //   },
  //   //   {
  //   //     $unwind: '$subCategory',
  //   //   },
  //   //   {
  //   //     $unwind: '$module',
  //   //   },
  //   //   {
  //   //     $match: {
  //   //       '$subject.name': allQueryParams.subject,
  //   //     },
  //   //   },
  //   //   {
  //   //     $count: 'totalDocs',
  //   //   },
  //   //   {
  //   //     $skip: 0,
  //   //   },
  //   //   {
  //   //     $limit: 10,
  //   //   },
  //   // ]);
  // }

  async filter(allQueryParams: Filter) {
    const pipeline = [
      {
        $match: {
          $or: [
            {"subject.name" : allQueryParams.subject},
            {"subCategory.name": allQueryParams.subCategory},
            {"module.name": allQueryParams.module}
          ]
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $unwind: "$subCategory",
      },
      {
        $lookup: {
          from: "modules",
          localField: "module",
          foreignField: "_id",
          as: "module",
        },
      },
      {
        $unwind: "$module",
      },
      {
        $match: {
          $or: [
            {"subject.name" : allQueryParams.subject},
            {"subCategory.name": allQueryParams.subCategory},
            {"module.name": allQueryParams.module}
          ]
        }
      },
      {
        $skip: allQueryParams.limit * (allQueryParams.page - 1),
      },
      {
        $limit: allQueryParams.limit * 1,
      },
    ];
  
    return this.questionModel.aggregate(pipeline);
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
