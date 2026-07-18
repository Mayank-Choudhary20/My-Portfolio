import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateResumeDto) {
    return this.prisma.resume.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.resume.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findLatest() {
    return this.prisma.resume.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  update(id: string, dto: UpdateResumeDto) {
    return this.prisma.resume.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.resume.delete({
      where: { id },
    });
  }
}