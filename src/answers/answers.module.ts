import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnsweredPaper, AnsweredPaperSchema } from './schemas/answered-papers.schema';
import { PapersService } from 'src/papers/papers.service';
import { Paper, PaperSchema } from 'src/papers/schemas/paper.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { Answered, AnsweredQuestionSchema } from './schemas/answered.schema';
import { PapersModule } from 'src/papers/papers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnsweredPaper.name, schema: AnsweredPaperSchema},
      { name: Paper.name, schema: PaperSchema },
      { name: Question.name, schema: QuestionSchema, },
      // { name: Answered.name, schema: AnsweredQuestionSchema, },
    ]),

    PapersModule
  ],
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule {}
