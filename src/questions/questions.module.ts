import { Module, forwardRef } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Subject, SubjectSchema } from 'src/subjects/schemas/subject.schema';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { PapersModule } from 'src/lms/papers/papers.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Question.name, schema: QuestionSchema },
        { name: Subject.name, schema: SubjectSchema },
      ],
      'quizbank',
    ),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
