import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: dto,
    });
  }

  findProfile() {
    return this.prisma.profile.findFirst();
  }

  update(id: string, dto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}