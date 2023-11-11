import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<SubCategory>;

@Schema()
export class SubCategory {
  @Prop({ type: String, required: true })
  name: string;
}

export const SubCategorytSchema = SchemaFactory.createForClass(SubCategory);
