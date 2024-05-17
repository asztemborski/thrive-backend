import { ICommand } from '@nestjs/cqrs';

export class SignInCommand implements ICommand {
  readonly email: string;
  readonly password: string;

  constructor(properties: SignInCommand) {
    Object.assign(this, properties);
  }
}
