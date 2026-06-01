import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalProjects,
      totalSkills,
      totalExperience,
      totalEducation,
      totalCertificates,
      totalShowcase,
      totalContacts,
      unreadContacts,
      totalVisitors,
      totalAiKnowledge,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.skill.count(),
      this.prisma.experience.count(),
      this.prisma.education.count(),
      this.prisma.certificate.count(),
      this.prisma.showcase.count(),
      this.prisma.contact.count(),
      this.prisma.contact.count({ where: { isRead: false } }),
      this.prisma.visitor.count(),
      this.prisma.aiKnowledge.count(),
    ]);

    return {
      totalProjects,
      totalSkills,
      totalExperience,
      totalEducation,
      totalCertificates,
      totalShowcase,
      totalContacts,
      unreadContacts,
      totalVisitors,
      totalAiKnowledge,
    };
  }
}