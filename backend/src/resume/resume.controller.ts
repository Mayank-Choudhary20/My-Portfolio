import {
  Controller,
  Get,
  Post,
 Patch,
  Delete,
 Param,
 Body,
 UseGuards,
} from '@nestjs/common';

import { ResumeService } from './resume.service';

import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  getLatest() {
    return this.resumeService.findLatest();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateResumeDto) {
    return this.resumeService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumeService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}