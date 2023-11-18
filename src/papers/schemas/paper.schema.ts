import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaperType } from 'src/enums/paperType.enum';

export type PaperDocument = HydratedDocument<Paper>;

@Schema()
export class Paper {
  @Prop({ type: String, unique: true, required: true })
  paperId: string;

  @Prop({ type: Number, required: true })
  timeInMinutes: Number;

  @Prop({
    type: String,
    enum: PaperType,
    required: true,
    default: PaperType.PRACTICE,
  })
  paperType: PaperType;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, required: true, default: [] }])
  questions: string;
}

export const PaperSchema = SchemaFactory.createForClass(Paper);
