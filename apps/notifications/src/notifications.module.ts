import { Module } from '@nestjs/common';
import { TypedConfigModule } from 'nest-typed-config';

import { MailModule } from './mail/mail.module';
import { configOptions } from './config';

@Module({
  imports: [TypedConfigModule.forRoot(configOptions), MailModule],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}
