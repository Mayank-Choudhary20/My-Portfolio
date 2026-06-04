import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    return exp;
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.experience.create({
      data: {
        company: String(data.company),
        role: String(data.role),
        description: String(data.description),
        startDate: new Date(String(data.startDate)),
        endDate: data.endDate && data.endDate !== '' && data.endDate !== null
          ? new Date(String(data.endDate))
          : null,
        current: Boolean(data.current),
        companyLogo: data.companyLogo ? String(data.companyLogo) : null,
        technologies: Array.isArray(data.technologies)
          ? (data.technologies as string[])
          : typeof data.technologies === 'string'
          ? (data.technologies as string)
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
      },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');

    const updateData: Record<string, unknown> = {};

    if (data.company !== undefined) updateData.company = String(data.company);
    if (data.role !== undefined) updateData.role = String(data.role);
    if (data.description !== undefined) updateData.description = String(data.description);
    if (data.current !== undefined) updateData.current = Boolean(data.current);
    if (data.companyLogo !== undefined) {
      updateData.companyLogo = data.companyLogo ? String(data.companyLogo) : null;
    }

    if (data.startDate !== undefined && data.startDate !== '') {
      try {
        updateData.startDate = new Date(String(data.startDate));
      } catch {
        // keep existing
      }
    }

    if (data.current) {
      updateData.endDate = null;
    } else if (data.endDate !== undefined) {
      updateData.endDate =
        data.endDate && data.endDate !== ''
          ? new Date(String(data.endDate))
          : null;
    }

    if (data.technologies !== undefined) {
      updateData.technologies = Array.isArray(data.technologies)
        ? (data.technologies as string[])
        : typeof data.technologies === 'string'
        ? (data.technologies as string)
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [];
    }

    return this.prisma.experience.update({
      where: { id },
      data: updateData as never,
    });
  }

  async remove(id: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    return this.prisma.experience.delete({ where: { id } });
  }
}