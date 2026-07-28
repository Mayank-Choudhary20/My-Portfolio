import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { SseService }     from '../sse/sse.service';
import { JwtAuthGuard }   from '../auth/jwt/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly sseService: SseService,
  ) {}

  // Public — no JWT guard (contact form submission)
  @Post()
  async create(
    @Body() body: { name: string; email: string; subject: string; message: string },
  ) {
    const result = await this.contactService.create(body);
    this.sseService.emit('contacts', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    const result = await this.contactService.markRead(id);
    this.sseService.emit('contacts', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.contactService.remove(id);
    this.sseService.emit('contacts', 'deleted');
    return result;
  }
}