import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateVisitorDto) {
    return this.prisma.visitor.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.visitor.findMany({
      orderBy: {
        visitedAt: 'desc',
      },
    });
  }
}