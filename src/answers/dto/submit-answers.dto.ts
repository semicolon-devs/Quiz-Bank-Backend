import { ObjectId } from "mongoose";

export class SubmitAnswerDto {
    // :userId/:paper_id/:question_index
    readonly userId : string;
    readonly paperId : string;
    readonly answer: number[];
    questionIndex : string | number;
    submittedAt : Date;
}

export class FinishPaperDto {
    readonly userId : string;
    readonly paperId : string;
    submittedAt : Date;   
}

export class GetAnswerRequestDto {
    readonly userId : string;
    readonly paperId : string | ObjectId;
    readonly questionIndex : number;
}