import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';

@Injectable()
export class VisitorsService {
  private readonly logger = new Logger(VisitorsService.name);

  constructor(private prisma: PrismaService) {}

  // ── Track visitor with duplicate prevention ──────────────────
  async track(dto: CreateVisitorDto): Promise<void> {
    try {
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      );

      const existing = await this.prisma.visitor.findFirst({
        where: {
          ip:      dto.ip      ?? undefined,
          browser: dto.browser ?? undefined,
          device:  dto.device  ?? undefined,
          visitedAt: {
            gte: twentyFourHoursAgo,
          },
        },
      });

      if (existing) {
        await this.prisma.visitor.update({
          where: { id: existing.id },
          data:  { visitedAt: new Date() },
        });
        this.logger.debug(`Visitor updated: ${existing.id}`);
        return;
      }

      await this.prisma.visitor.create({
        data: {
          ip:      dto.ip,
          country: dto.country,
          city:    dto.city,
          device:  dto.device,
          browser: dto.browser,
          os:      dto.os,
        },
      });

      this.logger.debug(`New visitor tracked: ${dto.ip}`);
    } catch (err) {
      this.logger.error('Visitor tracking failed', err);
    }
  }

  // ── Get all visitors (for admin dashboard) ───────────────────
  async getAll(): Promise<{
    id: string;
    ip: string | null;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    visitedAt: Date;
  }[]> {
    try {
      return await this.prisma.visitor.findMany({
        orderBy: { visitedAt: 'desc' },
      });
    } catch (err) {
      this.logger.error('Failed to fetch all visitors', err);
      return [];
    }
  }

  // ── Admin stats (full) ───────────────────────────────────────
  async getStats(): Promise<{
    totalVisitors:       number;
    todayVisitors:       number;
    thisWeekVisitors:    number;
    countries:           number;
    cities:              number;
    returningPercentage: number;
    topCountries:        Array<{ country: string; count: number }>;
    topCities:           Array<{ city: string; count: number }>;
    topBrowsers:         Array<{ browser: string; count: number }>;
    topDevices:          Array<{ device: string; count: number }>;
    topOs:               Array<{ os: string; count: number }>;
  }> {
    try {
      const now        = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

      const [
        totalVisitors,
        todayVisitors,
        thisWeekVisitors,
        allVisitors,
      ] = await Promise.all([
        this.prisma.visitor.count(),

        this.prisma.visitor.count({
          where: { visitedAt: { gte: todayStart } },
        }),

        this.prisma.visitor.count({
          where: { visitedAt: { gte: weekStart } },
        }),

        this.prisma.visitor.findMany({
          select: {
            ip:      true,
            country: true,
            city:    true,
            browser: true,
            device:  true,
            os:      true,
          },
        }),
      ]);

      // Unique countries / cities
      const uniqueCountries = new Set(
        allVisitors.map((v) => v.country).filter((c): c is string => !!c),
      );
      const uniqueCities = new Set(
        allVisitors.map((v) => v.city).filter((c): c is string => !!c),
      );

      // Returning visitors
      const ipCounts = new Map<string, number>();
      for (const v of allVisitors) {
        if (!v.ip) continue;
        ipCounts.set(v.ip, (ipCounts.get(v.ip) ?? 0) + 1);
      }
      const totalIps     = ipCounts.size;
      const returningIps = [...ipCounts.values()].filter((c) => c > 1).length;
      const returningPercentage =
        totalIps > 0 ? Math.round((returningIps / totalIps) * 100) : 0;

      // Top countries
      const countryMap = new Map<string, number>();
      for (const v of allVisitors) {
        if (!v.country) continue;
        countryMap.set(v.country, (countryMap.get(v.country) ?? 0) + 1);
      }
      const topCountries = [...countryMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, count]) => ({ country, count }));

      // Top cities
      const cityMap = new Map<string, number>();
      for (const v of allVisitors) {
        if (!v.city) continue;
        cityMap.set(v.city, (cityMap.get(v.city) ?? 0) + 1);
      }
      const topCities = [...cityMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([city, count]) => ({ city, count }));

      // Top browsers
      const browserMap = new Map<string, number>();
      for (const v of allVisitors) {
        if (!v.browser) continue;
        browserMap.set(v.browser, (browserMap.get(v.browser) ?? 0) + 1);
      }
      const topBrowsers = [...browserMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([browser, count]) => ({ browser, count }));

      // Top devices
      const deviceMap = new Map<string, number>();
      for (const v of allVisitors) {
        if (!v.device) continue;
        deviceMap.set(v.device, (deviceMap.get(v.device) ?? 0) + 1);
      }
      const topDevices = [...deviceMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([device, count]) => ({ device, count }));

      // Top OS
      const osMap = new Map<string, number>();
      for (const v of allVisitors) {
        if (!v.os) continue;
        osMap.set(v.os, (osMap.get(v.os) ?? 0) + 1);
      }
      const topOs = [...osMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([os, count]) => ({ os, count }));

      return {
        totalVisitors,
        todayVisitors,
        thisWeekVisitors,
        countries:           uniqueCountries.size,
        cities:              uniqueCities.size,
        returningPercentage,
        topCountries,
        topCities,
        topBrowsers,
        topDevices,
        topOs,
      };
    } catch (err) {
      this.logger.error('Failed to fetch visitor stats', err);
      return {
        totalVisitors:       0,
        todayVisitors:       0,
        thisWeekVisitors:    0,
        countries:           0,
        cities:              0,
        returningPercentage: 0,
        topCountries:        [],
        topCities:           [],
        topBrowsers:         [],
        topDevices:          [],
        topOs:               [],
      };
    }
  }
}