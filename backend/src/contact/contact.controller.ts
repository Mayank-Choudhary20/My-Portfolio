import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ContactService } from './contact.service';
import { SseService }     from '../sse/sse.service';
import { JwtAuthGuard }   from '../auth/jwt/jwt-auth.guard';

// ── Browser / device / OS parsers (same as visitors controller) ───────────────
function parseBrowser(ua: string): string {
  if (/brave/i.test(ua))     return 'Brave';
  if (/edg/i.test(ua))       return 'Edge';
  if (/opr|opera/i.test(ua)) return 'Opera';
  if (/firefox/i.test(ua))   return 'Firefox';
  if (/chrome/i.test(ua))    return 'Chrome';
  if (/safari/i.test(ua))    return 'Safari';
  return 'Other';
}

function parseDevice(ua: string): string {
  if (/mobile/i.test(ua))      return 'Mobile';
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly sseService:     SseService,
  ) {}

  // ── POST /contact — public (contact form submission) ─────────────────────
  @Post()
  async create(
    @Body() body: { name: string; email: string; subject: string; message: string },
    @Req()  req:  Request,
  ) {
    const ua = req.headers['user-agent'] ?? '';

    // Geo headers — present when request goes through Vercel → backend
    // If the frontend Next.js API route forwards them, they will be here.
    // If not, they fall back to null gracefully.
    const country =
      (req.headers['x-vercel-ip-country'] as string | undefined) ??
      (req.headers['cf-ipcountry']         as string | undefined) ??
      null;

    const city =
      (req.headers['x-vercel-ip-city'] as string | undefined) ??
      (req.headers['cf-ipcity']         as string | undefined) ??
      null;

    const result = await this.contactService.create({
      ...body,
      country,
      city,
      browser: parseBrowser(ua),
      device:  parseDevice(ua),
    });

    this.sseService.emit('contacts', 'created');
    return result;
  }

  // ── GET /contact — admin only ─────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  // ── GET /contact/:id — admin only ─────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  // ── PATCH /contact/:id/read — admin only ──────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    const result = await this.contactService.markRead(id);
    this.sseService.emit('contacts', 'updated');
    return result;
  }

  // ── DELETE /contact/:id — admin only ──────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.contactService.remove(id);
    this.sseService.emit('contacts', 'deleted');
    return result;
  }
}