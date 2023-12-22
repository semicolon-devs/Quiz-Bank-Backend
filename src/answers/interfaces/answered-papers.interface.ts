export interface AnsweredPaperInterface {
    userId: string;
    attempts: AttemptInterface[];
}


export interface AttemptInterface {
    attemptId: string;
    paperId : string;
    startedAt: Date;
    finishedAt: Date;
    hasFinished: boolean;
    remainingTime: string;
    answers?: AnsweredInterface[];
    createdAt?: Date;
    updatedAt?: Date;
}


export interface AnsweredInterface {
    number: number;
    answer: string;
    answeredAt?: Date;
}

