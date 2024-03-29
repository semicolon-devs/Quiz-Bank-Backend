import { PartialType } from '@nestjs/mapped-types';
import { SettingsDto } from './create-settings.dto';

export class UpdateSettingsDto extends PartialType(SettingsDto) {}
