import { ICommand } from '@nestjs/cqrs';

export class VerifyEmailCommand implements ICommand {
  readonly token: string;

  constructor(properties: VerifyEmailCommand) {
    Object.assign(this, properties);
  }
}
