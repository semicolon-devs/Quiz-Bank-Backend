import { Module, forwardRef } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paper, PaperSchema } from './schemas/paper.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { AnswersModule } from 'src/answers/answers.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    forwardRef(() => AnswersModule),

    MongooseModule.forFeature([
      { name: Paper.name, schema: PaperSchema },
      { name: Question.name, schema: QuestionSchema },
    ], 'quizbank'),

  ],
  providers: [PapersService],
  controllers: [PapersController],
  exports: [PapersService],
})
export class PapersModule {}
