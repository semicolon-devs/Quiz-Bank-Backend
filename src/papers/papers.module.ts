import { Module } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paper, PaperSchema } from './schemas/paper.schema';
import {
  Question,
  QuestionSchema,
} from 'src/questions/schemas/question.schema';
import { QuestionsService } from 'src/questions/questions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Paper.name, schema: PaperSchema },
      {
        name: Question.name,
        schema: QuestionSchema,
      },
    ]),
  ],
  providers: [PapersService, QuestionsService],
  controllers: [PapersController],
})
export class PapersModule {}
