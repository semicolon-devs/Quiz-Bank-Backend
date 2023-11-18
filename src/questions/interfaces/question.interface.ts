import { ObjectId } from 'mongoose';
import { QuestionType } from 'src/enums/questionType.enum';

export interface QuestionInterface {
  subject: ObjectId;
  subCategory: ObjectId;
  type: QuestionType;
  question: string;
  answers: AnswerInterface[];
  difficulty: string,
  correctAnswer: Number[];
  explaination: string;
}

export interface AnswerInterface {
  number: Number;
  answer: string;
}

export interface UpdateQuestionInterface {
  subject?: ObjectId;
  subCategory?: ObjectId;
  type?: QuestionType;
  question?: string;
  answers?: AnswerInterface[];
  defficulty?: string,
  correctAnswer?: Number[];
  explaination?: string;
}
