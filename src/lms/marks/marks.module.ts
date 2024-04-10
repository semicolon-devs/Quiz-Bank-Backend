import { Module } from '@nestjs/common';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Marks, MarksSchema } from './schemas/marks.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Marks.name, schema: MarksSchema }],
      'lms',
    ),
  ],
  controllers: [MarksController],
  providers: [MarksService],
})
export class MarksModule {}
