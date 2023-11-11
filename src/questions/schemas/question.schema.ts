import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionType } from 'src/enums/questionType.enum';
import { Answer } from './answer.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects',
    required: true,
  })
  subject: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subCategory',
    required: true,
  })
  subCategory: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
  question: string;

  @Prop([{ type: Answer, required: true }])
  answers: Answer[];

  @Prop({ type: Number, required: true })
  correctAnswer: Number;

  @Prop({type: String, required: true})
  explaination: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
