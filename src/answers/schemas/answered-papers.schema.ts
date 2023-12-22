import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Attempt } from "./attempts.schema";

export type AnsweredPaperDocument = HydratedDocument<AnsweredPaper>;

@Schema({ timestamps: true})
export class AnsweredPaper {
    @Prop({type: String, required: true})
    userId: string;

    @Prop([{type: Attempt}]) // required??
    attempts: Attempt[];

}

export const AnsweredPaperSchema = SchemaFactory.createForClass(AnsweredPaper);
