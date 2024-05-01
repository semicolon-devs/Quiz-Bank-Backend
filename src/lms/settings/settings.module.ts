import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './schemas/settings.schema';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { PapersModule } from '../papers/papers.module';
import { NotesModule } from '../notes/notes.module';
import { Paper, PaperSchema } from '../papers/schemas/paper.schema';
import { Note, NoteSchema } from '../notes/schemas/note.schema';
import { NotesService } from '../notes/notes.service';
import { PapersService } from '../papers/papers.service';
import { Paper as QbPaper, PaperSchema as QbPaperSchema } from 'src/papers/schemas/paper.schema';

@Module({
  imports: [
    UsersModule,
    PapersModule,
    NotesModule,
    MongooseModule.forFeature(
      [
        { name: Settings.name, schema: SettingsSchema },
        { name: Paper.name, schema: PaperSchema },
        { name: Note.name, schema: NoteSchema },
      ],
      'lms',
    ),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: QbPaper.name, schema: QbPaperSchema },
        { name: Paper.name, schema: PaperSchema },
      ],
      'quizbank',
    ),
  ],
  controllers: [SettingsController],
  providers: [SettingsService, NotesService, PapersService],
})
export class SettingsModule {}
