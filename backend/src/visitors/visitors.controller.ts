import {
  Controller,
  Post,
  Get,
  Req,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

// ── UA parsers (still used as fallback) ───────────────────────
function parseBrowser(ua: string): string {
  if (/brave/i.test(ua))     return 'Brave';
  if (/edg/i.test(ua))       return 'Edge';
  if (/opr|opera/i.test(ua)) return 'Opera';
  if (/firefox/i.test(ua))   return 'Firefox';
  if (/chrome/i.test(ua))    return 'Chrome';
  if (/safari/i.test(ua))    return 'Safari';
  return 'Other';
}

function parseOS(ua: string): string {
  if (/android/i.test(ua))           return 'Android';
  if (/iphone|ipad|ipod/i.test(ua))  return 'iOS';
  if (/windows/i.test(ua))           return 'Windows';
  if (/macintosh|mac os/i.test(ua))  return 'macOS';
  if (/ubuntu/i.test(ua))            return 'Ubuntu';
  if (/linux/i.test(ua))             return 'Linux';
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

  // ── POST /visitor ─────────────────────────────────────────────
  // Called by the Next.js /api/track route which forwards:
  //   { country, city, ip, userAgent }
  // All geo data comes from the body — NOT from headers —
  // because Vercel geo headers are not forwarded to Render.
  @Post()
  @HttpCode(HttpStatus.OK)
  async track(
    @Req() req: Request,
    @Body() body: CreateVisitorDto,
  ): Promise<{ ok: boolean }> {

    // Use UA from body (sent by Next.js route) or fallback to header
    const ua = body.userAgent ?? req.headers['user-agent'] ?? '';

    // Use IP from body (more accurate, extracted at Vercel edge)
    // or fallback to socket IP
    const ip = body.ip || extractIp(req) || undefined;

    // country and city come from body — set by the Next.js route
    // which has access to Vercel's x-vercel-ip-* headers
    const country = body.country || undefined;
    const city    = body.city    || undefined;

    const dto: CreateVisitorDto = {
      ip,
      country,
      city,
      browser: parseBrowser(ua),
      os:      parseOS(ua),
      device:  parseDevice(ua),
    };

    void this.visitorsService.track(dto);
    return { ok: true };
  }

  // ── GET /visitor — admin only ─────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.visitorsService.getAll();
  }

  // ── GET /visitor/stats — public ───────────────────────────────
  @Get('stats')
  getStats() {
    return this.visitorsService.getStats();
  }
}