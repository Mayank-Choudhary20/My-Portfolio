import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      projects,
      certificates,
      experiences,
      visitors,
      contacts,
      unreadContacts,
      featuredProjects,
      latestVisitors,
      latestContacts,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.certificate.count(),
      this.prisma.experience.count(),
      this.prisma.visitor.count(),
      this.prisma.contact.count(),

      this.prisma.contact.count({
        where: {
          isRead: false,
        },
      }),

      this.prisma.project.count({
        where: {
          featured: true,
        },
      }),

      this.prisma.visitor.findMany({
        take: 5,
        orderBy: {
          visitedAt: 'desc',
        },
      }),

      this.prisma.contact.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      projects,
      certificates,
      experiences,
      visitors,
      contacts,
      unreadContacts,
      featuredProjects,
      latestVisitors,
      latestContacts,
    };
  }
}