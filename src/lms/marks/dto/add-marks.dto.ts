import { ObjectId } from 'mongoose';

export class AddmarksDto {
  userId: ObjectId;
  paperId: ObjectId;
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
