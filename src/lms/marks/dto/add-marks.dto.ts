import { ObjectId } from 'mongoose';

export class AddmarksDto {
  userId: ObjectId;
  paperId: ObjectId;
  reading: number;
  generalKnowledge: number;
  logicalReasoning: number;
  ProblemSolving: number;
  biology: number;
  chemistry: number;
  physicsAndMaths: number;
  didNotAnswer: number;
  wrongAnswer: number;
  corrcetAnswer: number;
  lostmarks: number;
  total: number;
}
