import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { SseService }    from '../sse/sse.service';
import { JwtAuthGuard }  from '../auth/jwt/jwt-auth.guard';

@Controller('resume')
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  getResume() {
    return this.resumeService.getResume();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { title: string; fileUrl: string; thumbnailUrl?: string | null }) {
    const result = await this.resumeService.create(body);
    this.sseService.emit('resume', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateByPut(@Body() body: { title?: string; fileUrl?: string; thumbnailUrl?: string | null }) {
    const result = await this.resumeService.updateByBody(body);
    this.sseService.emit('resume', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; fileUrl?: string; thumbnailUrl?: string | null },
  ) {
    const result = await this.resumeService.update(id, body);
    this.sseService.emit('resume', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.resumeService.remove(id);
    this.sseService.emit('resume', 'deleted');
    return result;
  }
}