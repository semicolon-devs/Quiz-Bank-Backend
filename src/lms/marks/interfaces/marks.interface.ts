import { ObjectId } from 'mongoose';

export interface Marks {
  paperId: ObjectId;
  userId: ObjectId;
  marks: number;
}
