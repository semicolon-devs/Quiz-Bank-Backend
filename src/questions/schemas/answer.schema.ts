import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop({ type: Number, required: true })
  number: Number;

  @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
  answer: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
