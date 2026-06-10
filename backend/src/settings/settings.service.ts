import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.setting.findFirst();
    if (!settings) {
      return this.prisma.setting.create({
        data: {
          portfolioName:     'My Portfolio',
          heroTitle:         'Full Stack Developer',
          heroSubtitle:      'Building amazing things',
          heroGreeting:      "Hello, I'm",
          heroAvailableText: 'Available for Opportunities',
          heroBusyText:      'Currently Occupied',
          heroTypingTexts:   JSON.stringify([
            'AI / ML Engineer',
            'Full Stack Developer',
            'System Architect',
            'Open Source Builder',
            'Problem Solver',
          ]),
        },
      });
    }
    return settings;
  }

  async updateSettings(data: Record<string, unknown>) {
    const settings = await this.prisma.setting.findFirst();

    const {
      id: _id,
      createdAt: _ca,
      updatedAt: _ua,
      ...rest
    } = data;

    const updateData: Record<string, unknown> = {};

    const allowedFields = [
      'portfolioName',
      'heroTitle',
      'heroSubtitle',
      'heroGreeting',
      'heroAvailableText',
      'heroBusyText',
      'heroTypingTexts',
      'githubUrl',
      'linkedinUrl',
      'twitterUrl',
      'instagramUrl',
      'youtubeUrl',
      'leetcodeUrl',
      'codechefUrl',
      'email',
      'phone',
      'location',
      'resumeUrl',
      'seoTitle',
      'seoDescription',
      'primaryColor',
    ];

    allowedFields.forEach((field) => {
      if (rest[field] !== undefined) {
        updateData[field] = rest[field] === '' ? null : rest[field];
      }
    });

    if (!settings) {
      return this.prisma.setting.create({
        data: {
          portfolioName:     String(updateData.portfolioName || 'My Portfolio'),
          heroTitle:         String(updateData.heroTitle || 'Developer'),
          heroSubtitle:      String(updateData.heroSubtitle || ''),
          heroGreeting:      String(updateData.heroGreeting || "Hello, I'm"),
          heroAvailableText: String(updateData.heroAvailableText || 'Available for Opportunities'),
          heroBusyText:      String(updateData.heroBusyText || 'Currently Occupied'),
          ...updateData,
        } as never,
      });
    }

    return this.prisma.setting.update({
      where: { id: settings.id },
      data:  updateData as never,
    });
  }

  async createSettings(data: Record<string, unknown>) {
    const {
      id: _id,
      createdAt: _ca,
      updatedAt: _ua,
      ...rest
    } = data;

    return this.prisma.setting.create({
      data: {
        portfolioName:     String(rest.portfolioName || 'My Portfolio'),
        heroTitle:         String(rest.heroTitle || 'Developer'),
        heroSubtitle:      String(rest.heroSubtitle || ''),
        heroGreeting:      String(rest.heroGreeting || "Hello, I'm"),
        heroAvailableText: String(rest.heroAvailableText || 'Available for Opportunities'),
        heroBusyText:      String(rest.heroBusyText || 'Currently Occupied'),
        ...rest,
      } as never,
    });
  }
}