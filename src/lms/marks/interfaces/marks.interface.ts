import { ObjectId } from 'mongoose';

export interface Marks {
  paperId: ObjectId;
  userId: ObjectId;
  reading: number;
  logicalAndProblemSolving: number;
  biology: number;
  chemistry: number;
  physicsAndMaths: number;
  didNotAnswer: number;
  wrongAnswer: number;
  corrcetAnswer: number;
  lostmarks: number;
  total: number;
}
