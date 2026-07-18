import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ExperienceModule } from './experience/experience.module';
import { ResumeModule } from './resume/resume.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    ProjectsModule,
    AuthModule,
    UploadModule,
    CertificatesModule,
    ExperienceModule,
    ResumeModule,
  ],
})
export class AppModule {}