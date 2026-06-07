import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}

  async getResume() {
    const resume = await this.prisma.resume.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return resume ?? null;
  }

  async create(data: { title: string; fileUrl: string; thumbnailUrl?: string | null }) {
    return this.prisma.resume.create({
      data: {
        title:        data.title,
        fileUrl:      data.fileUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
  }

  async update(id: string, data: { title?: string; fileUrl?: string; thumbnailUrl?: string | null }) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    return this.prisma.resume.update({
      where: { id },
      data: {
        title:        data.title   ?? resume.title,
        fileUrl:      data.fileUrl ?? resume.fileUrl,
        // Only update thumbnailUrl if it was passed in the request
        thumbnailUrl: data.thumbnailUrl !== undefined ? data.thumbnailUrl : resume.thumbnailUrl,
      },
    });
  }

  async updateByBody(data: { title?: string; fileUrl?: string; thumbnailUrl?: string | null }) {
    const resume = await this.prisma.resume.findFirst();
    if (!resume) {
      return this.prisma.resume.create({
        data: {
          title:        data.title   || 'Resume',
          fileUrl:      data.fileUrl || '',
          thumbnailUrl: data.thumbnailUrl || null,
        },
      });
    }
    return this.prisma.resume.update({
      where: { id: resume.id },
      data: {
        title:        data.title   ?? resume.title,
        fileUrl:      data.fileUrl ?? resume.fileUrl,
        thumbnailUrl: data.thumbnailUrl !== undefined ? data.thumbnailUrl : resume.thumbnailUrl,
      },
    });
  }

  async remove(id: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    return this.prisma.resume.delete({ where: { id } });
  }
}