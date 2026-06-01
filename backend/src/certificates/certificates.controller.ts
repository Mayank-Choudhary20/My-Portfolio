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
import { CertificatesService }  from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { SseService }           from '../sse/sse.service';
import { JwtAuthGuard }         from '../auth/jwt/jwt-auth.guard';

@Controller('certificates')
export class CertificatesController {
  constructor(
    private readonly certificatesService: CertificatesService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateCertificateDto) {
    const result = await this.certificatesService.create(dto);
    this.sseService.emit('certificates', 'created');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    const result = await this.certificatesService.update(id, dto);
    this.sseService.emit('certificates', 'updated');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.certificatesService.remove(id);
    this.sseService.emit('certificates', 'deleted');
    return result;
  }
}