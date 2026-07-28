import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard() {
    return this.dashboardService.getStats();
  }
}