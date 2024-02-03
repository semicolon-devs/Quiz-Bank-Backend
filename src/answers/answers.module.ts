import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnsweredPaper, AnsweredPaperSchema } from './schemas/answered-papers.schema';
import { Paper, PaperSchema } from 'src/papers/schemas/paper.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { PapersModule } from 'src/papers/papers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnsweredPaper.name, schema: AnsweredPaperSchema},
      { name: Paper.name, schema: PaperSchema },
      { name: Question.name, schema: QuestionSchema, },
    ]),

    PapersModule
  ],
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule {}
