import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { PapersModule } from './papers/papers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/schemas/user.schema';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    AuthModule,
    NotesModule,
    PapersModule,
    UsersModule,
    SettingsModule,
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
            path: 'settings',
            module: SettingsModule,
          },
        ],
      },
    ]),
  ],
})
export class LmsModule {}
