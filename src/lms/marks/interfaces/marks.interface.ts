import { ObjectId } from 'mongoose';

export interface Marks {
  paperId: ObjectId;
  userId: ObjectId;
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
