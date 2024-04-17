import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnsweredPaper, AnsweredPaperSchema } from './schemas/answered-papers.schema';
import { PapersModule } from 'src/papers/papers.module';

@Module({
  imports: [
    forwardRef(() => PapersModule),

    MongooseModule.forFeature([
      { name: AnsweredPaper.name, schema: AnsweredPaperSchema},
    ], 'quizbank'),

  ],
  
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
