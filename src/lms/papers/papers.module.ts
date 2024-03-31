import { Module } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paper, PaperSchema } from './schemas/paper.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Paper.name, schema: PaperSchema }],
      'lms',
    ),
  ],
  controllers: [PapersController],
  providers: [PapersService],
})
export class PapersModule {}
