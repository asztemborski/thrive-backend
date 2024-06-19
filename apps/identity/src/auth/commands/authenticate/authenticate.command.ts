import { ICommand } from '@nestjs/cqrs';

export class AuthenticateCommand implements ICommand {
  readonly email: string;
  readonly password: string;

  constructor(properties: AuthenticateCommand) {
    Object.assign(this, properties);
  }
}
