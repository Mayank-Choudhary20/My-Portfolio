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
import { SkillsService }    from './skills.service';
import { CreateSkillDto }   from './dto/create-skill.dto';
import { UpdateSkillDto }   from './dto/update-skill.dto';
import { SseService }       from '../sse/sse.service';
import { JwtAuthGuard }     from '../auth/jwt/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateSkillDto) {
    const result = await this.skillsService.create(dto);
    this.sseService.emit('skills', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    const result = await this.skillsService.update(id, dto);
    this.sseService.emit('skills', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.skillsService.remove(id);
    this.sseService.emit('skills', 'deleted');
    return result;
  }
}