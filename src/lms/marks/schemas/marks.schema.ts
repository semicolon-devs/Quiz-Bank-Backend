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
  marks: number;
}

export const MarksSchema = SchemaFactory.createForClass(Marks);
