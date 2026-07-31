import { Module, Global } from '@nestjs/common';
import { NotificationService } from './notification.service';

// @Global() makes NotificationService available everywhere
// without needing to import NotificationModule in every feature module.
// Just import it once in AppModule and inject NotificationService anywhere.
@Global()
@Module({
  providers: [NotificationService],
  exports:   [NotificationService],
})
export class NotificationModule {}