import { ICommand } from '@nestjs/cqrs';

export class LogoutAllCommand implements ICommand {
  constructor(readonly accountId: string) {}
}
