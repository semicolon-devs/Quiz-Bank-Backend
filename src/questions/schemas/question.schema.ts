import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Subject } from 'src/enums/subjects.enum';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ type: String, enum: Subject, required: true })
  subject: Subject;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({type: Blob, required: false})
  image: Blob

  @Prop([{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Answer" }])
  answers: String[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
