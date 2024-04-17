import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnsweredsDocument = HydratedDocument<Answered>;

@Schema()
export class Answered {
  @Prop({ type: Number, required: true })
  number: number;

  @Prop([{ type: Number, required: true }])
  answer: number[];

  @Prop({ type: Date })
  answeredAt?: Date;
}
