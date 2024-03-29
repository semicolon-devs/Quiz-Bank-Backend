import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './schemas/settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Settings.name, schema: SettingsSchema }],
      'lms',
    ),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
