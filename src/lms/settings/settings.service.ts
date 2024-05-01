import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings } from './schemas/settings.schema';
import { Settings as ISettings } from './interfaces/settings.interface';
import { Model } from 'mongoose';
import { SettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UsersService } from 'src/users/users.service';
import { PapersService } from '../papers/papers.service';
import { NotesService } from '../notes/notes.service';
import { Paper as QbPaper } from 'src/papers/schemas/paper.schema';
import { User } from 'src/users/schemas/user.schema';
import { Role } from 'src/enums/roles.enum';
import { Note } from '../notes/schemas/note.schema';
import { Paper } from '../papers/schemas/paper.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name, 'lms')
    private readonly settingsmodel: Model<Settings>,
    @InjectModel(Note.name, 'lms')
    private readonly notesmodel: Model<Note>,
    @InjectModel(Settings.name, 'lms')
    private readonly papersmodel: Model<Paper>,
    @InjectModel(Paper.name, 'quizbank')
    private readonly qbPapermodel: Model<QbPaper>,
    @InjectModel(User.name, 'quizbank')
    private readonly usermodel: Model<User>,

    private userServices: UsersService,
    private paperService: PapersService,
    private noteService: NotesService,
  ) {}

  // only use this if necceocery, use the update route to change settings
  async create(data: SettingsDto): Promise<ISettings> {
    return await this.settingsmodel.create(data);
  }

  async getSettings() {
    const result = await this.settingsmodel.findOne({});
    if (result != null) {
      return result;
    } else {
      throw new HttpException('Settings  not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(data: UpdateSettingsDto): Promise<ISettings> {
    return this.settingsmodel.findOneAndUpdate({}, data).exec();
  }

  async delete() {
    return this.settingsmodel.deleteMany({});
  }

  // TODO: add other data to delete
  async deleteAllData() {
    await this.userServices.deleteAllLMSUsers();
    await this.noteService.removeAll();
    await this.paperService.removeAll();

    return 'all data deleted';
  }

  async getDashboardData() {
    const NoOfQuizs = await this.qbPapermodel.count({ isArchived: false }).exec();
    const NoOfUsers = await this.usermodel.count({ roles: Role.USER }).exec();
    const NoOfLmsUsers = await this.usermodel.count({ roles: Role.LMS_USER }).exec();
    const NoOfNotes = await this.notesmodel.count({}).exec();
    const NoOfPapers = await this.papersmodel.count({}).exec();
    // const NoOfNotes = this.noteService.getNotesCount();
    // const NoOfPapers = this.paperService.getPapersCount();

    return {
      quizs: NoOfQuizs,
      users: NoOfUsers,
      lmsUsers: NoOfLmsUsers,
      notes: NoOfNotes,
      papers: NoOfPapers
    };
    // return {
    //   students: NoOfUsers,
    //   notes: NoOfNotes,
    //   papers: NoOfPapers,
    //   quizs: NoOfQuizs,
    // };
  }
}
