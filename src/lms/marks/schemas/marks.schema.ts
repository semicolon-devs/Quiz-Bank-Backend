import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type MarksDocument = HydratedDocument<Marks>;

@Schema()
export class Marks {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true })
  paperId: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  userId: ObjectId;

  @Prop({ type: Number, required: true })
  reading: number;

  @Prop({ type: Number, required: true })
  logicalAndProblemSolving: number;

  @Prop({ type: Number, required: true })
  biology: number;

  @Prop({ type: Number, required: true })
  chemistry: number;

  @Prop({ type: Number, required: true })
  physicsAndMaths: number;

  @Prop({ type: Number, required: true })
  didNotAnswer: number;

  @Prop({ type: Number, required: true })
  wrongAnswer: number;

  @Prop({ type: Number, required: true })
  corrcetAnswer: number;

  @Prop({ type: Number, required: true })
  lostmarks: number;

  @Prop({ type: Number, required: true })
  total: number;
}

export const MarksSchema = SchemaFactory.createForClass(Marks);
