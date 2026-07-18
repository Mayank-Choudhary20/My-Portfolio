import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';


@Injectable()
export class SettingsService {

  constructor(
    private prisma: PrismaService,
  ) {}


  create(dto: CreateSettingsDto) {

    return this.prisma.setting.create({
      data: dto,
    });

  }


  find() {

    return this.prisma.setting.findFirst();

  }


  async update(
    id: string,
    dto: UpdateSettingsDto,
  ) {


    const setting =
      await this.prisma.setting.findUnique({
        where:{
          id,
        },
      });


    if(!setting){

      throw new NotFoundException(
        'Settings not found'
      );

    }


    return this.prisma.setting.update({

      where:{
        id,
      },

      data:dto,

    });

  }

}