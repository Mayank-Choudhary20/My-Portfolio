import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

function parseBrowser(ua: string): string {
  if (/brave/i.test(ua))      return 'Brave';
  if (/edg/i.test(ua))        return 'Edge';
  if (/opr|opera/i.test(ua))  return 'Opera';
  if (/firefox/i.test(ua))    return 'Firefox';
  if (/chrome/i.test(ua))     return 'Chrome';
  if (/safari/i.test(ua))     return 'Safari';
  return 'Other';
}

function parseOS(ua: string): string {
  if (/android/i.test(ua))          return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows/i.test(ua))          return 'Windows';
  if (/macintosh|mac os/i.test(ua)) return 'macOS';
  if (/ubuntu/i.test(ua))           return 'Ubuntu';
  if (/linux/i.test(ua))            return 'Linux';
  return 'Other';
}

function parseDevice(ua: string): string {
  if (/mobile/i.test(ua))      return 'Mobile';
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

function extractIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(',')[0];
    return ip.trim();
  }
  return req.socket?.remoteAddress ?? '';
}

@Controller('visitor')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  // ── POST /visitor — public, called by portfolio on page load ─
  @Post()
  @HttpCode(HttpStatus.OK)
  async track(@Req() req: Request): Promise<{ ok: boolean }> {
    const ua      = req.headers['user-agent'] ?? '';
    const ip      = extractIp(req);
    const country = (req.headers['x-vercel-ip-country'] as string)
      ?? (req.headers['cf-ipcountry'] as string)
      ?? null;
    const city    = (req.headers['x-vercel-ip-city'] as string)
      ?? (req.headers['cf-ipcity'] as string)
      ?? null;

    const dto: CreateVisitorDto = {
      ip:      ip      || undefined,
      country: country || undefined,
      city:    city    || undefined,
      browser: parseBrowser(ua),
      os:      parseOS(ua),
      device:  parseDevice(ua),
    };

    void this.visitorsService.track(dto);
    return { ok: true };
  }

  // ── GET /visitor — admin only, returns raw visitor data ──────
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.visitorsService.getAll();
  }

  // ── GET /visitor/stats — PUBLIC, displayed on portfolio footer
  // No JwtAuthGuard — aggregated stats only, no PII exposed
  @Get('stats')
  getStats() {
    return this.visitorsService.getStats();
  }
}