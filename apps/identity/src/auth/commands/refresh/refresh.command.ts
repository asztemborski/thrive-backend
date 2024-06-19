import { ICommand } from '@nestjs/cqrs';

export class RefreshCommand implements ICommand {
  readonly refreshToken: string;

  constructor(token: string) {
    this.refreshToken = token;
  }
}
