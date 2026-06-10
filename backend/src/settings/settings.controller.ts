import {
  Body, Controller, Get, Patch, Post, Put, UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SseService }      from '../sse/sse.service';
import { JwtAuthGuard }    from '../auth/jwt/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  getSettings() { return this.settingsService.getSettings(); }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateByPut(@Body() body: Record<string, unknown>) {
    const result = await this.settingsService.updateSettings(body);
    this.sseService.emit('settings', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateByPatch(@Body() body: Record<string, unknown>) {
    const result = await this.settingsService.updateSettings(body);
    this.sseService.emit('settings', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSettings(@Body() body: Record<string, unknown>) {
    const result = await this.settingsService.createSettings(body);
    this.sseService.emit('settings', 'created');
    return result;
  }
}