import { ObjectId } from 'mongoose';

export class AddmarksDto {
  userId: ObjectId;
  marks: Marks[];
}

class Marks {
  paperId: ObjectId;
  marks: number;
}
