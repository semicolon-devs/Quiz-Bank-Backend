import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schemas/note.schema';
import { Model, ObjectId } from 'mongoose';
import { Note as INote } from './interfaces/note.interface';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name, 'lms') private readonly noteModel: Model<Note>,
  ) {}

  create(createNoteDto: CreateNoteDto) {
    const note: INote = {
      title: createNoteDto.title,
      fileId: createNoteDto.fileId,
    };
    return this.noteModel.create(note);
  }

  findAll() {
    return this.noteModel.find().exec();
  }

  findOne(id: ObjectId) {
    return this.noteModel.findById(id).exec();
  }

  update(id: ObjectId, updateNoteDto: UpdateNoteDto) {
    return this.noteModel.findByIdAndUpdate(id, updateNoteDto, { new: true });
  }

  remove(id: ObjectId) {
    return this.noteModel.findByIdAndRemove(id);
  }

  removeAll() {
    return this.noteModel.deleteMany({});
  }
}
