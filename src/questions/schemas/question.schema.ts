import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionType } from 'src/enums/questionType.enum';
import { Answer } from './answer.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  })
  subject: string;

  @Prop({ type: String, required: true, default: 'Easy' })
  difficulty: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  })
  subCategory: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
  question: string;

  @Prop([{ type: Answer, required: true }])
  answers: Answer[];

  @Prop([{ type: Number, required: true }])
  correctAnswer: Number[];

  @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
  explaination: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
