import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AiService }      from './ai.service';
import { CreateAiDto }    from './dto/create-ai.dto';
import { UpdateAiDto }    from './dto/update-ai.dto';
import { SseService }     from '../sse/sse.service';
import { JwtAuthGuard }   from '../auth/jwt/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  findAll() {
    return this.aiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateAiDto) {
    const result = await this.aiService.create(dto);
    this.sseService.emit('ai', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAiDto) {
    const result = await this.aiService.update(id, dto);
    this.sseService.emit('ai', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.aiService.remove(id);
    this.sseService.emit('ai', 'deleted');
    return result;
  }
}