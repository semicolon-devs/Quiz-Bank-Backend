import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Answer } from "src/questions/schemas/answer.schema";

export type AttemptsDocument = HydratedDocument<Attempt>;

@Schema( {timestamps: true})
export class Attempt {
    @Prop({ type: String, required: true })
    attemptId: string;

    @Prop({ type: String, required: true})
    paperId : string;
    
    @Prop({type: Date})
    startedAt: Date;

    @Prop({type: Date})
    finishedAt: Date;

    @Prop({type: Boolean, required: true})
    hasFinished: boolean;

    @Prop({type: String, required: true})
    remainingTime: string;

    @Prop({type: Answer }) // required?
    answers: Answer[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}


export const AttemptSchema = SchemaFactory.createForClass(Attempt);
