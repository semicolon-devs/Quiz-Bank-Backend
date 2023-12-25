import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Answered } from "./answered.schema";

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

    @Prop([{type: Answered }]) // Change...?
    answers?: Answered[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

}


export const AttemptSchema = SchemaFactory.createForClass(Attempt);
