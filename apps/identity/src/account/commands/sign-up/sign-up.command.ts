import { ICommand } from '@nestjs/cqrs';

export class SignUpCommand implements ICommand {
  readonly email: string;
  readonly username: string;
  readonly password: string;

  constructor(properties: SignUpCommand) {
    Object.assign(this, properties);
  }
}
