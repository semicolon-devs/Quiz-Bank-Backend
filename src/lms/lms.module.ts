import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { PapersModule } from './papers/papers.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { MarksModule } from './marks/marks.module';

@Module({
  imports: [
    AuthModule,
    NotesModule,
    PapersModule,
    UsersModule,
    SettingsModule,
    MarksModule,
    RouterModule.register([
      {
        path: 'api/v1/lms',
        module: LmsModule,
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
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
