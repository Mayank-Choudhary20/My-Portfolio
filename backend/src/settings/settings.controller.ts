import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SettingsService } from './settings.service';

import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSettingsDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  find() {
    return this.settingsService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.settingsService.update(id, dto);
  }
}