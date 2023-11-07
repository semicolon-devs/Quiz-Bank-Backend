import { QuestionType } from 'src/enums/questionType.enum';
import { Subject } from 'src/enums/subjects.enum';

export class CreateQuestionDto {
  readonly subject: Subject;
  readonly category: string;
  readonly type: QuestionType;
  readonly question: string;
  readonly answers: [Answer];
}

class Answer {
    readonly number: Number;
    readonly text: string;
}
