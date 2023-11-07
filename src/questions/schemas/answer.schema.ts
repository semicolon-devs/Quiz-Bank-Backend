import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop({ type: Number, required: true })
  number: Number;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Blob, required: false })
  type: Blob;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
