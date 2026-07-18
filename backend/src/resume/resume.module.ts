import { Module } from '@nestjs/common';

import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}