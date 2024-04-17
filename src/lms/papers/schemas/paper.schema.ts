import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaperDocument = HydratedDocument<Paper>;

@Schema()
export class Paper {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  fileId: string;
}

export const PaperSchema = SchemaFactory.createForClass(Paper);
