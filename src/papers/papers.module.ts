import { Module } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paper, PaperSchema } from './schemas/paper.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { AnswersService } from 'src/answers/answers.service';
import { AnsweredPaper, AnsweredPaperSchema } from 'src/answers/schemas/answered-papers.schema';
import { AnswersModule } from 'src/answers/answers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Paper.name, schema: PaperSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: AnsweredPaper.name, schema: AnsweredPaperSchema},

    ]),
  ],
  providers: [PapersService, AnswersService],
  controllers: [PapersController],
})
export class PapersModule {}
