import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { IMailService } from './mail.service';
import { UserCreatedEventDto } from './dtos';

@Controller()
export class MailController {
  constructor(@Inject(IMailService) private readonly mailService: IMailService) {}

  @EventPattern('user_created')
  async sendEmailVerification(@Payload() data: UserCreatedEventDto): Promise<void> {
    await this.mailService.sendVerification(data.email, data.url, data.username);
  }
}
