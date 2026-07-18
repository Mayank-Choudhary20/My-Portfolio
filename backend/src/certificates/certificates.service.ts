import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  create(createCertificateDto: CreateCertificateDto) {
    return this.prisma.certificate.create({
      data: {
        ...createCertificateDto,
        issueDate: new Date(createCertificateDto.issueDate),
      },
    });
  }

  findAll() {
    return this.prisma.certificate.findMany({
      orderBy: {
        issueDate: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.certificate.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCertificateDto: UpdateCertificateDto) {
    return this.prisma.certificate.update({
      where: { id },
      data: {
        ...updateCertificateDto,
        issueDate: updateCertificateDto.issueDate
          ? new Date(updateCertificateDto.issueDate)
          : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.certificate.delete({
      where: { id },
    });
  }
}