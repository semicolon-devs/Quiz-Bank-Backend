import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AnsweredsDocument = HydratedDocument<Answered>;


@Schema()
export class Answered {
    @Prop({ type: Number, required: true })
    number: number;
  
    @Prop({ type: String, maxlength: 20 * 1024 * 1024, required: true })
    answer: string;
  
    @Prop({type: Date})
    answeredAt?: Date;
}