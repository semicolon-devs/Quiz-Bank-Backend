import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Answer } from './answer.schema';

export type AnswerDocument = HydratedDocument<CorrectAnswer>;

@Schema()
export class CorrectAnswer {
  @Prop({ type: Answer, required: true })
  answer: Answer;

  @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
  explanation: string;
}

export const CorrectAnswerSchema = SchemaFactory.createForClass(CorrectAnswer);
