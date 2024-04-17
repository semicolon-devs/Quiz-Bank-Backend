import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { NotesModule } from './notes/notes.module';
import { PapersModule } from './papers/papers.module';
import { SettingsModule } from './settings/settings.module';
import { MarksModule } from './marks/marks.module';

@Module({
  imports: [
    NotesModule,
    PapersModule,
    SettingsModule,
    MarksModule,
    RouterModule.register([
      {
        path: 'api/v1/lms',
        module: LmsModule,
        children: [
          {
            path: 'notes',
            module: NotesModule,
          },
          {
            path: 'papers',
            module: PapersModule,
          },
          {
            path: 'marks',
            module: MarksModule,
          },
          {
            path: 'settings',
            module: SettingsModule,
          },
        ],
      },
    ]),
  ],
})
export class LmsModule {}
