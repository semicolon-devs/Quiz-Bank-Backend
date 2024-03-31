import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtAuthGuard as JwtAuthGuardLms } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Controller('')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() data: SettingsDto) {
    return await this.settingsService.create(data);
  }

  @UseGuards(JwtAuthGuardLms)
  @Get()
  async getSettings() {
    return await this.settingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getSettingsAdmin() {
    return await this.settingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Patch()
  async update(@Body() data: UpdateSettingsDto) {
    return await this.settingsService.update(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async deleteAllSettings() {
    return await this.settingsService.delete();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete('all')
  async deleteAllData() {
    return await this.settingsService.deleteAllData();
  }
}
