import { ObjectId } from "mongoose";

export class SubmitAnswerDto {
    // :userId/:paper_id/:question_index
    readonly userId : string;
    readonly paperId : string;
    readonly questionIndex : string;
    readonly answer: string;
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