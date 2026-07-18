import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public endpoint (frontend will call this)
  @Post('visit')
  create(@Body() dto: CreateVisitorDto) {
    return this.analyticsService.create(dto);
  }

  // Protected endpoint (admin only)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.analyticsService.findAll();
  }
}