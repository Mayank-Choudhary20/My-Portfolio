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
import { EducationService }    from './education.service';
import { CreateEducationDto }  from './dto/create-education.dto';
import { UpdateEducationDto }  from './dto/update-education.dto';
import { SseService }          from '../sse/sse.service';
import { JwtAuthGuard }        from '../auth/jwt/jwt-auth.guard';

@Controller('education')
export class EducationController {
  constructor(
    private readonly educationService: EducationService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateEducationDto) {
    const result = await this.educationService.create(dto);
    this.sseService.emit('education', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEducationDto) {
    const result = await this.educationService.update(id, dto);
    this.sseService.emit('education', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.educationService.remove(id);
    this.sseService.emit('education', 'deleted');
    return result;
  }
}