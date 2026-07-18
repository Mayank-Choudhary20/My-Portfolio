import { Module } from '@nestjs/common';

import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}