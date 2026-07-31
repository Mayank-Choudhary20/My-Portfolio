import { Module }            from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService }    from './contact.service';
import { PrismaModule }      from '../prisma/prisma.module';
// NotificationModule is @Global() so NotificationService is already
// available — no import needed here. Just inject it in ContactService.

@Module({
  imports:     [PrismaModule],
  controllers: [ContactController],
  providers:   [ContactService],
})
export class ContactModule {}