import { Global, Module } from '@nestjs/common';
import { SseService }    from './sse.service';
import { SseController } from './sse.controller';

// Global so every other module can inject SseService
// without importing SseModule explicitly
@Global()
@Module({
  controllers: [SseController],
  providers:   [SseService],
  exports:     [SseService],
})
export class SseModule {}