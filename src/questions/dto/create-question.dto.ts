import { ObjectId } from 'mongoose';
import { QuestionType } from 'src/enums/questionType.enum';

export class CreateQuestionDto {
  readonly subject: ObjectId;
  readonly subCategory: ObjectId;
  readonly type: QuestionType;
  readonly question: string;
  readonly answers: Answer[];
  readonly correctAnswer: Number;
  readonly explaination: string;
}

class Answer {
    readonly number: Number;
    readonly answer: string;
}

