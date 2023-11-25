import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { SubCategory, SubCategorytSchema } from './schemas/subCategory.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { Module as Module1, ModuleSchema } from './schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subject.name, schema: SubjectSchema },
      { name: SubCategory.name, schema: SubCategorytSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Module1.name, schema: ModuleSchema },
    ]),
  ],
  providers: [SubjectsService],
  controllers: [SubjectsController],
})
export class SubjectsModule {}
