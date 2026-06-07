import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findProfile() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('Profile not found. Please create one first.');
    }
    return profile;
  }

  async create(data: {
    name: string;
    title: string;
    tagline: string;
    about: string;
    email: string;
    phone: string;
    location: string;
    profileImage: string;
    github: string;
    linkedin: string;
    yearsExperience: number;
    available?: boolean;
    mission?: string;
    leetcode?: string;
    codechef?: string;
    codeforces?: string;
    twitter?: string;
    instagram?: string;
  }) {
    return this.prisma.profile.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');

    const { id: _id, createdAt, updatedAt, ...rest } = data;

    return this.prisma.profile.update({
      where: { id },
      data: this.sanitizeProfileData(rest),
    });
  }

  async updateByBody(data: Record<string, unknown>) {
    const profile = await this.prisma.profile.findFirst();

    if (!profile) {
      const { id: _id, createdAt, updatedAt, ...rest } = data;
      return this.prisma.profile.create({
        data: this.sanitizeProfileData(rest) as never,
      });
    }

    const { id: _id, createdAt, updatedAt, ...rest } = data;

    return this.prisma.profile.update({
      where: { id: profile.id },
      data: this.sanitizeProfileData(rest),
    });
  }

  async remove(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return this.prisma.profile.delete({ where: { id } });
  }

  private sanitizeProfileData(data: Record<string, unknown>) {
    const result: Record<string, unknown> = {};

    if (data.name !== undefined) result.name = String(data.name);
    if (data.title !== undefined) result.title = String(data.title);
    if (data.tagline !== undefined) result.tagline = String(data.tagline);
    if (data.about !== undefined) result.about = String(data.about);
    if (data.email !== undefined) result.email = String(data.email);
    if (data.phone !== undefined) result.phone = String(data.phone);
    if (data.location !== undefined) result.location = String(data.location);
    if (data.profileImage !== undefined) result.profileImage = String(data.profileImage);
    if (data.github !== undefined) result.github = String(data.github);
    if (data.linkedin !== undefined) result.linkedin = String(data.linkedin);
    if (data.yearsExperience !== undefined) result.yearsExperience = Number(data.yearsExperience) || 0;
    if (data.available !== undefined) result.available = Boolean(data.available);
    if (data.mission !== undefined) result.mission = data.mission ? String(data.mission) : null;
    if (data.leetcode !== undefined) result.leetcode = data.leetcode ? String(data.leetcode) : null;
    if (data.codechef !== undefined) result.codechef = data.codechef ? String(data.codechef) : null;
    if (data.codeforces !== undefined) result.codeforces = data.codeforces ? String(data.codeforces) : null;
    if (data.twitter !== undefined) result.twitter = data.twitter ? String(data.twitter) : null;
    if (data.instagram !== undefined) result.instagram = data.instagram ? String(data.instagram) : null;

    return result;
  }
}