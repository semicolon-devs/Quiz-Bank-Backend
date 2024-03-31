import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './schemas/settings.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PapersModule } from '../papers/papers.module';
import { NotesModule } from '../notes/notes.module';
import { Paper, PaperSchema } from '../papers/schemas/paper.schema';
import { Note, NoteSchema } from '../notes/schemas/note.schema';
import { NotesService } from '../notes/notes.service';
import { PapersService } from '../papers/papers.service';

@Module({
  imports: [
    UsersModule,
    PapersModule,
    NotesModule,
    MongooseModule.forFeature(
      [
        { name: Settings.name, schema: SettingsSchema },
        { name: User.name, schema: UserSchema },
        { name: Paper.name, schema: PaperSchema },
        { name: Note.name, schema: NoteSchema },
      ],
      'lms',
    ),
  ],
  controllers: [SettingsController],
  providers: [SettingsService, UsersService, NotesService, PapersService],
})
export class SettingsModule {}
