import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './schemas/settings.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Settings.name, schema: SettingsSchema },
        { name: User.name, schema: UserSchema },
      ],
      'lms',
    ),
    UsersModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService, UsersService],
})
export class SettingsModule {}
