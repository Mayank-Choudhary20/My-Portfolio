import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SseService }     from '../sse/sse.service';
import { JwtAuthGuard }   from '../auth/jwt/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  getProfile() {
    return this.profileService.findProfile();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: Record<string, unknown>) {
    const result = await this.profileService.create(body as never);
    this.sseService.emit('profile', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateByPut(@Body() body: Record<string, unknown>) {
    const result = await this.profileService.updateByBody(body);
    this.sseService.emit('profile', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const result = await this.profileService.update(id, body as never);
    this.sseService.emit('profile', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.profileService.remove(id);
    this.sseService.emit('profile', 'deleted');
    return result;
  }
}