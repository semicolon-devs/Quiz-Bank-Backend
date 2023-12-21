import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FinishPaperDto, SubmitAnswerDto } from './dto/submit-answers.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AnsweredPaper } from './schemas/answered-papers.schema';
import { Attempt } from './schemas/attempts.schema';
import { Answer } from 'src/questions/schemas/answer.schema';


// TODO:: Work on proper exception handlings!
@Injectable()
export class AnswersService {
    constructor(
        @InjectModel(AnsweredPaper.name) private readonly answerPaperModel : Model<AnsweredPaper>
    ) {}

    async finishPaper(finishPaperDto: FinishPaperDto) {
        const submittedAt : Date = new Date();
        finishPaperDto.submittedAt = submittedAt;

        try {
            const filter = { userId: finishPaperDto.userId };

            const paper = await this.answerPaperModel.findOne(filter);

            // TODO:: When there are more than one attempt available
            if(paper && paper.attempts.length === 0) {
                const attempt : Attempt = paper.attempts[0];

                if(finishPaperDto.paperId != attempt.paperId) {
                    throw new HttpException('PaperId Mismatch', HttpStatus.BAD_REQUEST);
                }

                attempt.finishedAt = submittedAt;
                attempt.hasFinished = true;

                await paper.save();

                return "Paper Finished Successfully!";

            }else {
                throw new HttpException('No Attempt(s) found!', HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
            throw error;
        }
        
    }


    async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
        const answeredAt : Date = new Date();
        submitAnswerDto.submittedAt = answeredAt;

        try {
            const filter = { userId : submitAnswerDto.userId };

            let paper = await this.answerPaperModel.findOne(filter);
            
            const newAttempt : Attempt =  {
                attemptId: Date.now().toString(),
                remainingTime: "100",
                hasFinished: false,
                startedAt: answeredAt,
                updatedAt: answeredAt,
                paperId: submitAnswerDto.paperId,

                finishedAt: undefined,
                answers: [],
            }
            // TODO:: Has to work on the remaining time!!
            

            if(!paper) {

                const payload = {
                    userId: submitAnswerDto.userId,
                    attempts: [newAttempt]
                }
                paper = await this.answerPaperModel.create(payload)
            }

            //TODO:: Update the logic to deal with multiple attempts...
            if(paper.attempts.length === 0) { // if attempts array is empty
                paper.attempts.push(newAttempt);
                // paper = await paper.save();
            }else {
                if(paper.attempts[0].hasFinished)
                    throw new HttpException('Not Allowed', HttpStatus.BAD_REQUEST);
            }

            const currentAttempt : Attempt = paper.attempts[0];

            if(currentAttempt.paperId != submitAnswerDto.paperId) {
                throw new HttpException('PaperId Mismatch', HttpStatus.BAD_REQUEST);
            }

            const answers : Set<Answer> = new Set(currentAttempt.answers);

            const newAnswer : Answer = {
                number: Number(submitAnswerDto.questionIndex),
                answer: submitAnswerDto.answer,
                answeredAt: submitAnswerDto.submittedAt
            }
    
            answers.add(newAnswer);

            currentAttempt.answers = Array.from(answers);
            
            await paper.save();

            return "Successfully updated!";
            
        } catch (err) {
            throw err;
        }

        // logic stud!
        // check mongodb if userID exists, 
        // if not -> create,
        // then, 
    
        // check if attempt exists and 
        // --> hasnotfinished yet.       not yet implemented!
        // if not -> create new attempt

        // then
        // insert/ update answers array

    }

    async getAnsweredStatus(paperId: string, userId: string) {
        const paper : AnsweredPaper = await this.answerPaperModel.findOne({ userId, 'attempts.paperId': paperId });
        
        if(paper) {
            const answeredQuestions: number[] = [];

            paper.attempts.forEach((attempt) => {
                if (attempt.paperId === paperId) {
                attempt.answers.forEach((answer) => {
                    answeredQuestions.push(answer.number);
                });
                }
            });

            return answeredQuestions;

        }else {
            throw new HttpException('Paper Not found', HttpStatus.BAD_REQUEST);
        }


    }

    // getAnswer(userId: string, paperId: string, questionNo: string) {
    //     throw new Error('Method not implemented.');
    // }
}
