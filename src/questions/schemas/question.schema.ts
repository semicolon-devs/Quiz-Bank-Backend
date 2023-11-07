import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionType } from 'src/enums/questionType.enum';
import { Subject } from 'src/enums/subjects.enum';
import { Answer } from './answer.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ type: String, enum: Subject, required: true })
  subject: Subject;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
  question: string;

  @Prop([{ type: Answer, required: true }])
  answers: Answer[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
