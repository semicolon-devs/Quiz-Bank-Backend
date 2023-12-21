import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnsweredPaper, AnsweredPaperSchema } from './schemas/answered-papers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnsweredPaper.name, schema: AnsweredPaperSchema},
    ]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule {}
