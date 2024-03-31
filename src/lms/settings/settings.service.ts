import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings } from './schemas/settings.schema';
import { Settings as ISettings } from './interfaces/settings.interface';
import { Model } from 'mongoose';
import { SettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UsersService } from '../users/users.service';
import { PapersService } from '../papers/papers.service';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name, 'lms')
    private readonly settingsmodel: Model<Settings>,
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
    await this.userServices.deleteAll();
    await this.noteService.removeAll();
    await this.paperService.removeAll();
  }
}
