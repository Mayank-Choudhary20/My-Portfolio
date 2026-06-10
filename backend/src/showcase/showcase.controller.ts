import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ShowcaseService }    from './showcase.service';
import { CreateShowcaseDto }  from './dto/create-showcase.dto';
import { UpdateShowcaseDto }  from './dto/update-showcase.dto';
import { SseService }         from '../sse/sse.service';
import { JwtAuthGuard }       from '../auth/jwt/jwt-auth.guard';

@Controller('showcase')
export class ShowcaseController {
  constructor(
    private readonly showcaseService: ShowcaseService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  findAll() {
    return this.showcaseService.findAll();
  }

  @Get(':type')
  findType(@Param('type') type: string) {
    return this.showcaseService.findByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateShowcaseDto) {
    const result = await this.showcaseService.create(dto);
    this.sseService.emit('showcase', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateShowcaseDto) {
    const result = await this.showcaseService.update(id, dto);
    this.sseService.emit('showcase', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.showcaseService.remove(id);
    this.sseService.emit('showcase', 'deleted');
    return result;
  }
}