import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule }      from './prisma/prisma.module';
import { SseModule }         from './sse/sse.module';          // ← NEW
import { ProjectsModule }    from './projects/projects.module';
import { AuthModule }        from './auth/auth.module';
import { UploadModule }      from './upload/upload.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ExperienceModule }  from './experience/experience.module';
import { ResumeModule }      from './resume/resume.module';
import { ProfileModule }     from './profile/profile.module';
import { AnalyticsModule }   from './analytics/analytics.module';
import { ContactModule }     from './contact/contact.module';
import { DashboardModule }   from './dashboard/dashboard.module';
import { SettingsModule }    from './settings/settings.module';
import { AiModule }          from './ai/ai.module';
import { SkillsModule }      from './skills/skills.module';
import { EducationModule }   from './education/education.module';
import { ShowcaseModule }    from './showcase/showcase.module';
import { VisitorsModule }    from './visitors/visitors.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SseModule,               // ← NEW — must be before all entity modules
    ProjectsModule,
    AuthModule,
    UploadModule,
    CertificatesModule,
    ExperienceModule,
    ResumeModule,
    ProfileModule,
    AnalyticsModule,
    ContactModule,
    DashboardModule,
    SettingsModule,
    AiModule,
    SkillsModule,
    EducationModule,
    ShowcaseModule,
    VisitorsModule,
  ],
})
export class AppModule {}