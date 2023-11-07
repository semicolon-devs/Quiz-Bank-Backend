import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Answer } from './schemas/answer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) : Promise<Question> {
    const answersArray: Answer[] = [];
    createQuestionDto.answers.forEach((item) => {
      const answer : Answer = {
        number: item.number,
        answer: item.text,
      }
      answersArray.push(answer);
    })

    const question: Question = {
      subject: createQuestionDto.subject,
      category: createQuestionDto.category,
      type: createQuestionDto.type,
      question: createQuestionDto.question,
      answers: answersArray
    }

    const createdQuestion = this.questionModel.create(question);
    return createdQuestion;
  }

  findAll() {
    return `This action returns all questions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
