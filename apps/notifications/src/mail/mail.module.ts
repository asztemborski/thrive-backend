import { Module } from '@nestjs/common';

import { MailController } from './mail.controller';
import { IMailService, MailService } from './mail.service';

@Module({
  imports: [],
  providers: [
    {
      provide: IMailService,
      useClass: MailService,
    },
  ],
  controllers: [MailController],
})
export class MailModule {}
