import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { FinishPaperDto, GetAnswerRequestDto, SubmitAnswerDto } from './dto/submit-answers.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AnsweredPaper } from './schemas/answered-papers.schema';
import { Attempt } from './schemas/attempts.schema';
import { AnsweredInterface, AnsweredPaperInterface, AnswersInterface, AttemptInterface } from './interfaces/answered-papers.interface';
import { Answered } from './schemas/answered.schema';
import { PapersService } from 'src/papers/papers.service';


// TODO:: Work on proper exception handlings!
@Injectable()
export class AnswersService {
    constructor(
        @InjectModel(AnsweredPaper.name, 'quizbank') private readonly answerPaperModel : Model<AnsweredPaper>,
        @Inject(forwardRef(() => PapersService)) private readonly paperService: PapersService
    ) {}

    async finishPaper(finishPaperDto: FinishPaperDto) {
        const submittedAt : Date = new Date();
        finishPaperDto.submittedAt = submittedAt;

        try {
            const filter = { userId: finishPaperDto.userId };

            const paper = await this.answerPaperModel.findOne(filter);

            // TODO:: When there are more than one attempt available
            if(paper && paper.attempts.length != 0) {
                const attempt : Attempt = paper.attempts[0];

                if(finishPaperDto.paperId != attempt.paperId) {
                    throw new HttpException('PaperId Mismatch', HttpStatus.BAD_REQUEST);
                }

                attempt.finishedAt = submittedAt;
                attempt.hasFinished = false;


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

        submitAnswerDto.questionIndex = Number(submitAnswerDto.questionIndex);

        try {
            const filter = { userId : submitAnswerDto.userId };

            let paper = await this.answerPaperModel.findOne(filter);

            const attempts : AttemptInterface[] = [];
            const answered : AnsweredInterface[] = [];

            const newAttempt : AttemptInterface = {
                attemptId: Date.now().toString(),
                remainingTime: "100",
                hasFinished: false,
                startedAt: answeredAt,
                updatedAt: answeredAt,
                paperId: submitAnswerDto.paperId,

                finishedAt: undefined,
                answers: answered,
            }

            attempts.push(newAttempt);
            // TODO:: Has to work on the remaining time!!
            


            if(!paper) {

                const answeredPaper : AnsweredPaperInterface = {
                    userId: submitAnswerDto.userId,
                    attempts: attempts
                }

                paper = await this.answerPaperModel.create(answeredPaper)
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

            const answers : Set<Answered> = new Set(currentAttempt.answers);

            if(submitAnswerDto.questionIndex && submitAnswerDto.questionIndex <= 100) {
                answers.forEach((answer) => {
                    if(answer.number == submitAnswerDto.questionIndex){
                        answers.delete(answer);
                    }
                })
            }
            const newAnswer : Answered = {
                number: Number(submitAnswerDto.questionIndex),
                answer: submitAnswerDto.answer,
                answeredAt: submitAnswerDto.submittedAt
            }
    
            answers.add(newAnswer);

            currentAttempt.answers = Array.from(answers).sort((a, b) => a.number - b.number);
            
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
        const answeredQuestions: number[] = [];

        let totalQuestions;
        
        try{
            totalQuestions = await this.paperService.getNumberOfQuestions(paperId);
        }catch (err) {
            return {
                answered : answeredQuestions,
                totalQuesstions: -1,
                error : "Paper Not Found"
            };
        }
        
        if(paper) {

            paper.attempts.forEach((attempt) => {
                if (attempt.paperId === paperId) {
                attempt.answers.forEach((answer) => {
                    answeredQuestions.push(answer.number);
                });
                }
            });


            return {
                answered : answeredQuestions,
                totalQuestions: totalQuestions
            };

        }else {
            return {
                answered : answeredQuestions,
                totalQuestions: totalQuestions,
            };

        }


    }


    async getAnswer(getAnswerRequestDto: GetAnswerRequestDto) {
        try {
            const paper : AnsweredPaper = await this.answerPaperModel.findOne({ userId : getAnswerRequestDto.userId , 'attempts.paperId': getAnswerRequestDto.paperId });
      
            if(paper) {

                return paper.attempts[0].answers.find((ans) => ans.number == getAnswerRequestDto.questionIndex);

            }


        } catch (err) {
            throw err;
          }
    }




    async getFinishedStatus(paperId: string, userId: string) {
        const paper : AnsweredPaper = await this.answerPaperModel.findOne({ userId, 'attempts.paperId': paperId });
        
        if(paper) {
            if(paper.attempts[0].hasFinished) {
                return true;
            }else {
                return false;
            }

        }else {
            throw new HttpException('Paper Not found', HttpStatus.BAD_REQUEST);
        }
    }

    async getMarks(userId: string, paperId: string) {
        const answeredPaper : AnsweredPaper = await this.answerPaperModel.findOne({ userId, 'attempts.paperId': paperId });

        if(answeredPaper) {
            const answeredQuestionsArray : AnsweredInterface[] = answeredPaper.attempts[0].answers || [];
            let totalMarks = 0;

            for(const answeredQuestion of answeredQuestionsArray) {
                const answer = await this.paperService.findAnswer(paperId, answeredQuestion.number);

                if(answer.correctAnswer.every( answer => answeredQuestion.answer.includes(Number(answer))) ) {
                    totalMarks++;
                }
            }

            return {totalMarks: totalMarks};

        }else {
            throw new HttpException('Paper Not found', HttpStatus.BAD_REQUEST);
        }
    }

    async getCorrectStatus(userId: string, paperId: string) {
        const answeredPaper : AnsweredPaper = await this.answerPaperModel.findOne({ userId, 'attempts.paperId': paperId });
        const answers : AnswersInterface[] = [];

        if(answeredPaper) {
            const answeredQuestionsArray : AnsweredInterface[] = answeredPaper.attempts[0].answers || [];
            

            for(const answeredQuestion of answeredQuestionsArray) {
                const answer = await this.paperService.findAnswer(paperId, answeredQuestion.number);

                const ans: AnswersInterface = {
                                        index: answeredQuestion.number,
                                        isCorrect: false
                                    }

                // if(answer.correctAnswer.includes( Number(answeredQuestion.answer) ) ) {
                //     ans.isCorrect = true;
                // }else {
                //     ans.isCorrect = false;
                // }

                if(answer.correctAnswer.every( answer => answeredQuestion.answer.includes(Number(answer))) ) {
                    ans.isCorrect = true;
                }else {
                    ans.isCorrect = false;
                }

                answers.push(ans);
            }

            const totalQuesstions = await this.paperService.getNumberOfQuestions(paperId);

            return {
                answers: answers, 
                totalQuestions : totalQuesstions 
            };

        }else {
            return {
                answers: answers, 
                totalQuestions : -1,
                error : "Paper Not Found!"
            }
        }
    }

}
