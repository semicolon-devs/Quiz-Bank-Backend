import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schemas/question.schema';
import {
  AnswerInterface,
  QuestionInterface,
  UpdateQuestionInterface,
} from './interfaces/question.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CorrectAnswer } from './schemas/correctAnswer.schema';
import { FilterQuery } from './interfaces/filter.interface';

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
      type: createQuestionDto.type,
      question: createQuestionDto.question,
      answers: answersArray,
      difficulty: createQuestionDto.difficulty,
      correctAnswer: createQuestionDto.correctAnswer,
      explaination: createQuestionDto.explaination
    };

    const createdQuestion = this.questionModel.create(question);
    return createdQuestion;
  
  }

  async findAll(): Promise<Question[]> {
    return await this.questionModel.find({}).populate('subject').populate('subCategory');
  }

  async filter(allQueryParams: FilterQuery) {
    return this.questionModel.find(allQueryParams);
  }

  async findOne(id: string): Promise<Question> {
    return await this.questionModel.findById(id);
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
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

  async remove(id: string): Promise<string> {
    const result = await this.questionModel.findByIdAndDelete(id);
    return result ? 'deleted' : 'error deleting';
  }
}
