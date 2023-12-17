import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaperType } from 'src/enums/paperType.enum';

export type PaperDocument = HydratedDocument<Paper>;

@Schema()
export class Paper {
  @Prop({ type: String, unique: true, required: true })
  paperId: string;

  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  timeInMinutes: Number;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isTimed: boolean;
  
  @Prop({
    type: String,
    enum: PaperType,
    required: true,
    default: PaperType.MULTIPLE_ATTEMPT,
  })
  paperType: PaperType;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref:"Question", required: true, default: [] }])
  questions: string;
}

export const PaperSchema = SchemaFactory.createForClass(Paper);
