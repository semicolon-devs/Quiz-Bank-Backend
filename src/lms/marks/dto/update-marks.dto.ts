import { ObjectId } from 'mongoose';

export class UpdateMarksDto {
  userId?: ObjectId;
  paperId?: ObjectId;
  marks?: number;
}
