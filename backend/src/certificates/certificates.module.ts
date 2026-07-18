import { Module } from '@nestjs/common';

import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}