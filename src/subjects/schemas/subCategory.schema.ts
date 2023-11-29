import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<SubCategory>;

@Schema()
export class SubCategory {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
      default: [],
    },
  ])
  moduleList: string[];
}

export const SubCategorytSchema = SchemaFactory.createForClass(SubCategory);
