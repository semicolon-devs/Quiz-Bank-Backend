import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SubCategory } from './subCategory.schema';

export type QuestionDocument = HydratedDocument<Subject>;

@Schema()
export class Subject {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop([{ type: SubCategory, required: true, default: [] }])
  subCategories: SubCategory[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
