import {
  Controller,
  Get,
  Res,
  OnModuleInit,
} from '@nestjs/common';
import type { Response } from 'express';   // ← "import type" fixes isolatedModules error
import { SseService, SseEvent } from './sse.service';

@Controller('sse')
export class SseController implements OnModuleInit {
  private clients: Set<Response> = new Set();

  constructor(private readonly sseService: SseService) {}

  onModuleInit() {
    this.sseService.asObservable().subscribe((event: SseEvent) => {
      this.broadcast(event);
    });
  }

  @Get()
  subscribe(@Res() res: Response): void {
    res.setHeader('Content-Type',                'text/event-stream');
    res.setHeader('Cache-Control',               'no-cache, no-transform');
    res.setHeader('Connection',                  'keep-alive');
    res.setHeader('X-Accel-Buffering',           'no');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    this.clients.add(res);
    res.write(`event: connected\ndata: {"status":"ok"}\n\n`);

    const ping = setInterval(() => {
      if (!res.writableEnded) res.write(`: ping\n\n`);
    }, 25_000);

    res.on('close', () => {
      clearInterval(ping);
      this.clients.delete(res);
    });
  }

  private broadcast(event: SseEvent): void {
    const message = `event: portfolio-update\ndata: ${JSON.stringify(event)}\n\n`;
    for (const client of this.clients) {
      if (!client.writableEnded) {
        client.write(message);
      } else {
        this.clients.delete(client);
      }
    }
  }
}